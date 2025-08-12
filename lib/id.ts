import { Snowflake } from "@sapphire/snowflake";

/**
 * BigInt -> String
 */
export function serializeId(id: bigint | number): string {
  return id.toString();
}

/**
 * String -> BigInt
 */
export function deserializeId(id: string): bigint {
  return BigInt(id);
}

export function generateSnowflakeId(): bigint {
  const epoch = new Date("2025-01-01T00:00:00.000Z");
  // Create an instance of Snowflake
  const snowflake = new Snowflake(epoch);
  // Generate a snowflake with the given epoch
  const uniqueId = snowflake.generate();
  return uniqueId;
}
