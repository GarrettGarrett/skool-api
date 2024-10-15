# Backend Instructions

Use this guide for backend work in the project.

It uses Supabase, Drizzle ORM, and Server Actions.

Write the complete code for every step. Do not get lazy. Write everything that is needed.

Your goal is to completely finish whatever the user asks for.

## Steps

- new tables go in a new schema file in `/db/schema` like @example-schema.ts
  - export any new schemas in `/db/schema/index.ts` @schema/index.ts
  - add new tables to the schema in `/db/db.ts` @db.ts
- new queries go in a new queries file in `/db/queries` like @example-queries.ts
- add new actions to a new actions file in `/actions` like @example-actions.ts
- make sure to use the `ActionState` from `/types/action-types.ts` @action-types.ts
- once complete, make sure the user generates the new schema with `db:generate` and migrates it with `db:migrate`
- you may also be asked to implement frontend features, so make sure the above is complete before building out those frontend features
- use postgres for the database
- do not use Pool directly, use the db object from `/db/db.ts` @db.ts

## Requirements

- data fetching should be done in a server component and pass the data down as props

# Example types/actions/action-types.ts

```ts
export type ActionState = {
  status: "success" | "error";
  message: string;
  data?: any;
};
```

# Example queries/index.ts if we had profiles
```ts
export * from "./profiles-queries";
```

# Example queries/profile-queries.ts

```ts
import { eq } from "drizzle-orm";
import { db } from "../db";
import {
  InsertProfile,
  profilesTable,
  SelectProfile,
} from "../schema/profiles-schema";

export const createProfile = async (data: InsertProfile) => {
  try {
    const [newProfile] = await db
      .insert(profilesTable)
      .values(data)
      .returning();
    return newProfile;
  } catch (error) {
    console.error("Error creating profile: ", error);
    throw new Error("Failed to create profile");
  }
};

export const getMembershipByUserId = async (userId: string) => {
  try {
    const profile = await db.query.profilesTable.findFirst({
      where: eq(profilesTable.userId, userId),
    });
    return profile;
  } catch (error) {
    console.error("Error getting membership by user ID:", error);
    throw new Error("Failed to get membership");
  }
};
export const getProfileByUserId = async (userId: string) => {
  try {
    const profile = await db.query.profilesTable.findFirst({
      where: eq(profilesTable.userId, userId),
    });

    return profile;
  } catch (error) {
    console.error("Error getting profile by user ID:", error);
    throw new Error("Failed to get profile");
  }
};

export const getAllProfiles = async (): Promise<SelectProfile[]> => {
  return db.query.profilesTable.findMany();
};

export const updateProfile = async (
  userId: string,
  data: Partial<InsertProfile>
) => {
  try {
    const [updatedProfile] = await db
      .update(profilesTable)
      .set(data)
      .where(eq(profilesTable.userId, userId))
      .returning();
    return updatedProfile;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error("Failed to update profile");
  }
};

export const updateProfileByStripeCustomerId = async (
  stripeCustomerId: string,
  data: Partial<InsertProfile>
) => {
  try {
    const [updatedProfile] = await db
      .update(profilesTable)
      .set(data)
      .where(eq(profilesTable.stripeCustomerId, stripeCustomerId))
      .returning();
    return updatedProfile;
  } catch (error) {
    console.error("Error updating profile by stripe customer ID:", error);
    throw new Error("Failed to update profile");
  }
};

export const deleteProfile = async (userId: string) => {
  try {
    await db.delete(profilesTable).where(eq(profilesTable.userId, userId));
  } catch (error) {
    console.error("Error deleting profile:", error);
    throw new Error("Failed to delete profile");
  }
};
```

# Example actions/profile-actions.ts if we had profiles
```ts
"use server";

import {
  createProfile,
  deleteProfile,
  getAllProfiles,
  getMembershipByUserId,
  getProfileByUserId,
  updateProfile,
} from "@/db/queries/profile-queries";
import { InsertProfile } from "@/db/schema/profiles-schema";
import { ActionState } from "@/types/actions/action-types";
import console from "console";
import { revalidatePath } from "next/cache";

export async function createProfileAction(
  data: InsertProfile
): Promise<ActionState> {
  try {
    const newProfile = await createProfile(data);
    console.log("New profile created", newProfile);
    revalidatePath("/");
    return {
      status: "success",
      message: "Profile created successfully",
      data: newProfile,
    };
  } catch (error) {
    return { status: "error", message: "Error creating profile" };
  }
}

export async function getProfileByUserIdAction(
  userId: string
): Promise<ActionState> {
  try {
    const profile = await getProfileByUserId(userId);
    if (!profile) {
      return { status: "error", message: "Profile not found" };
    }
    return {
      status: "success",
      message: "Profile retrieved successfully",
      data: profile,
    };
  } catch (error) {
    return { status: "error", message: "Failed to get profile" };
  }
}

export async function getAllProfilesAction(): Promise<ActionState> {
  try {
    const profiles = await getAllProfiles();
    return {
      status: "success",
      message: "Profiles retrieved successfully",
      data: profiles,
    };
  } catch (error) {
    return { status: "error", message: "Failed to get profiles" };
  }
}

export async function updateProfileAction(
  userId: string,
  data: Partial<InsertProfile>
): Promise<ActionState> {
  try {
    const updatedProfile = await updateProfile(userId, data);
    revalidatePath("/profile");
    return {
      status: "success",
      message: "Profile updated successfully",
      data: updatedProfile,
    };
  } catch (error) {
    return { status: "error", message: "Failed to update profile" };
  }
}

export async function deleteProfileAction(
  userId: string
): Promise<ActionState> {
  try {
    await deleteProfile(userId);
    revalidatePath("/profile");
    return { status: "success", message: "Profile deleted successfully" };
  } catch (error) {
    return { status: "error", message: "Failed to delete profile" };
  }
}

export async function getMembershipByUserIdAction(
  userId: string
): Promise<ActionState> {
  try {
    const membership = await getMembershipByUserId(userId);
    // make it a number, if it's not a number, return 0
    const membershipNumber = Number(membership?.membership) || 0;
    return {
      status: "success",
      message: "Membership retrieved successfully",
      data: membershipNumber,
    };
  } catch (error) {
    return { status: "error", message: "Failed to get membership" };
  }
}
```
