import { describe, it, expect } from "@jest/globals";
import { createClient } from "../index";
import type { FetchResponse, GraphQLResponse } from "../graphql/client";

interface GetUsersResponse {
  users: {
    id: string;
    displayName: string;
    metadata: {
      source: string;
    };
  }[];
}

interface UpdateUsersDisplayNameResponse {
  updateUser: {
    id: string;
    displayName: string;
  };
}

describe("Nhost - Sign Up with Email and Password and upload file", () => {
  const nhost = createClient({
    subdomain: "local",
    region: "local",
  });

  let userID: string;

  it("should sign up a user with email and password", async () => {
    const resp = await nhost.auth.signUpEmailPassword({
      email: `test-${Date.now()}@example.com`,
      password: "password123",
      options: {
        displayName: "Test User",
        locale: "en",
        defaultRole: "user",
        allowedRoles: ["user"],
        metadata: {
          source: "test",
        },
      },
    });

    if (!resp.body.session) {
      throw new Error("Session is null");
    }
  });

  it("query", async () => {
    const users = await nhost.graphql.post<GetUsersResponse>({
      query: `query GetUsers {
          users {
            id
            displayName
            metadata
          }
        }`,
    });

    expect(users.body.data?.users).toBeDefined();
    expect(users.body.data?.users[0].id).toBeDefined();
    expect(users.body.data?.users[0].displayName).toBeDefined();
    expect(users.body.data?.users[0].metadata).toBeDefined();
    expect(users.body.data?.users[0].metadata.source).toBe("test");

    userID = users.body.data?.users[0].id || "";
  });

  it("mutate", async () => {
    const resp = await nhost.graphql.post<UpdateUsersDisplayNameResponse>({
      query: `mutation UpdateUsersDisplayName($id: uuid!, $displayName: String!) {
          updateUser(pk_columns: {id: $id}, _set: {displayName: $displayName}) {
            id
            displayName
          }
        }`,
      variables: {
        id: userID,
        displayName: "My New Display Name",
      },
      operationName: "UpdateUsersDisplayName",
    });

    expect(resp.body.data?.updateUser).toBeDefined();
    expect(resp.body.data?.updateUser.id).toBeDefined();
    expect(resp.body.data?.updateUser.displayName).toBe("My New Display Name");
  });

  it("errors: bad query", async () => {
    try {
      await nhost.graphql.post({
        query: `wrong query`,
      });

      expect(true).toBe(false);
    } catch (error) {
      const resp = error as FetchResponse<GraphQLResponse>;

      expect(resp.body.errors).toBeDefined();
      expect(resp.body.errors).toHaveLength(1);
      const errors = resp.body.errors!;
      expect(errors[0].message).toBe("not a valid graphql query");
      expect(errors[0].extensions?.path).toBe("$.query");
      expect(errors[0].extensions?.code).toBe("validation-failed");
    }
  });

  it("errors: no permissions or doesn't exist", async () => {
    try {
      await nhost.graphql.post({
        query: `query { restricted { id } }`,
      });

      expect(true).toBe(false);
    } catch (error) {
      const resp = error as FetchResponse<GraphQLResponse>;
      expect(resp.body.errors).toBeDefined();
      expect(resp.body.errors).toHaveLength(1);
      const errors = resp.body.errors!;
      expect(errors[0]?.message).toBe(
        "field 'restricted' not found in type: 'query_root'",
      );
      expect(errors[0].extensions?.path).toBe("$.selectionSet.restricted");
      expect(errors[0].extensions?.code).toBe("validation-failed");
    }
  });
});
