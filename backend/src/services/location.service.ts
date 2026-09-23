import { redis } from '../config/redis.js';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export class LocationService {
  /**
   * Update provider live location in Redis Geo Index
   */
  public static async updateProviderLocation(
    providerId: string,
    categoryId: string,
    coords: LocationCoordinates
  ): Promise<void> {
    const key = `active_providers:${categoryId}`;
    // GEOADD key longitude latitude member
    await redis.geoadd(key, coords.longitude, coords.latitude, providerId);
    
    // Also store last updated coordinates in a hash for quick lookup
    await redis.hset(`provider_coord:${providerId}`, {
      lat: coords.latitude.toString(),
      lng: coords.longitude.toString(),
      updatedAt: Date.now().toString(),
    });
  }

  /**
   * Remove provider from active geo index when going offline
   */
  public static async removeProviderFromActive(
    providerId: string,
    categoryId: string
  ): Promise<void> {
    const key = `active_providers:${categoryId}`;
    await redis.zrem(key, providerId);
    await redis.del(`provider_coord:${providerId}`);
  }

  /**
   * Search active providers within radius (in KM)
   */
  public static async findNearbyProviders(
    categoryId: string,
    coords: LocationCoordinates,
    radiusKm: number = 5,
    count: number = 5
  ): Promise<Array<{ providerId: string; distanceKm: number }>> {
    const key = `active_providers:${categoryId}`;

    try {
      // redis.geosearch(key, 'FROMLONLAT', lng, lat, 'BYRADIUS', radius, 'KM', 'WITHDIST', 'ASC', 'COUNT', count)
      const results = await redis.geosearch(
        key,
        'FROMLONLAT',
        coords.longitude,
        coords.latitude,
        'BYRADIUS',
        radiusKm,
        'KM',
        'WITHDIST',
        'ASC',
        'COUNT',
        count
      );

      if (!results || !Array.isArray(results)) {
        return [];
      }

      return (results as [string, string][]).map(([providerId, distStr]) => ({
        providerId,
        distanceKm: parseFloat(distStr),
      }));
    } catch (err: any) {
      console.error('⚠️ Redis GeoSearch Error (Falling back to empty array):', err.message);
      return [];
    }
  }
}
