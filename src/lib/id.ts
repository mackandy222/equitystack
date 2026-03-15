import { randomUUIDv7 } from "bun";

export function newId(): string {
  return randomUUIDv7();
}
