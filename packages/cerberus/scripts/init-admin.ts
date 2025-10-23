import { auth } from "../src/lib/auth";

/**
 * Initialize admin user script
 * Creates an admin user with the specified credentials using Better Auth API
 */
async function initAdmin() {
  try {
    //   const newUser = await auth.api.createUser({
    //   body: {
    //       email: "admin@rntlogistic-us.com",
    //       password: "12345678",
    //       name: "admin",
    //   },
    // });
    // console.log(newUser);

    const apiKey = await auth.api.createApiKey({
      body: {
        name: "rt-admin-key",
        // expiresIn: 60 * 60 * 24 * 7,
        userId: "8BkrloMArtFM1EmkoOPoUWTloN1FOHkV", // server-only
        prefix: "CBS_",
        rateLimitEnabled: false,
        // remaining: 100, // server-only
        // metadata: { someKey: 'someValue' },
        // refillAmount: 100, // server-only
        // refillInterval: 1000, // server-only
        // rateLimitTimeWindow: 1000, // server-only
        // rateLimitMax: 100, // server-only
        // rateLimitEnabled: true, // server-only
        // permissions,
      },
    });

    console.log(apiKey);
  } catch (error) {
    console.error("❌ Error creating admin user:", error);

    // If error is about existing user, try to update role
    if (error instanceof Error && error.message.includes("already exists")) {
      console.log("ℹ️  User already exists, attempting to set admin role...");
      // You may need to implement additional logic here based on Better Auth's error handling
    } else {
      process.exit(1);
    }
  }
}

// Run the script
initAdmin()
  .then(() => {
    console.log("\n✅ Admin initialization completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Admin initialization failed:", error);
    process.exit(1);
  });
