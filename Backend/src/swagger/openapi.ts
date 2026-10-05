export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Church Website API",
    version: "1.0.0"
  },
  servers: [{ url: "/api" }],
  tags: [
    { name: "Auth" },
    { name: "Users" },
    { name: "Events" },
    { name: "Announcements" },
    { name: "Services" },
    { name: "Projects" },
    { name: "Banners" },
    { name: "Public" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      Error: {
        type: "object",
        properties: { message: { type: "string" } }
      },
      Role: {
        type: "string",
        enum: ["ADMIN", "CONTENT_MANAGER"]
      },
      ContentStatus: {
        type: "string",
        enum: ["DRAFT", "IN_REVIEW", "PUBLISHED"]
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          email: { type: "string", format: "email" },
          role: { $ref: "#/components/schemas/Role" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string" }
        }
      },
      SignupRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 8 }
        }
      },
      LoginResponse: {
        type: "object",
        properties: {
          token: { type: "string" },
          user: {
            $ref: "#/components/schemas/User"
          }
        }
      },
      SignupResponse: {
        type: "object",
        properties: {
          token: { type: "string" },
          user: {
            $ref: "#/components/schemas/User"
          }
        }
      },
      UpdateUserRoleRequest: {
        type: "object",
        required: ["role"],
        properties: {
          role: { $ref: "#/components/schemas/Role" }
        }
      },
      Event: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          date: { type: "string", format: "date-time" },
          time: { type: "string" },
          imageUrl: { type: "string", nullable: true },
          status: { $ref: "#/components/schemas/ContentStatus" },
          createdById: { type: "string" },
          publishedAt: { type: "string", format: "date-time", nullable: true },
          publishedById: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      UpsertEventRequest: {
        type: "object",
        required: ["title", "description", "date", "time"],
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          date: { type: "string", format: "date-time" },
          time: { type: "string" },
          imageUrl: { type: "string", nullable: true }
        }
      },
      Announcement: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          content: { type: "string" },
          date: { type: "string", format: "date-time" },
          imageUrl: { type: "string", nullable: true },
          status: { $ref: "#/components/schemas/ContentStatus" },
          createdById: { type: "string" },
          publishedAt: { type: "string", format: "date-time", nullable: true },
          publishedById: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      UpsertAnnouncementRequest: {
        type: "object",
        required: ["title", "content", "date"],
        properties: {
          title: { type: "string" },
          content: { type: "string" },
          date: { type: "string", format: "date-time" },
          imageUrl: { type: "string", nullable: true }
        }
      },
      Service: {
        type: "object",
        properties: {
          id: { type: "string" },
          serviceTitle: { type: "string" },
          topic: { type: "string" },
          preacherName: { type: "string" },
          verse: { type: "string" },
          date: { type: "string", format: "date-time" },
          imageUrl: { type: "string", nullable: true },
          status: { $ref: "#/components/schemas/ContentStatus" },
          createdById: { type: "string" },
          publishedAt: { type: "string", format: "date-time", nullable: true },
          publishedById: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      UpsertServiceRequest: {
        type: "object",
        required: ["serviceTitle", "topic", "preacherName", "verse", "date"],
        properties: {
          serviceTitle: { type: "string" },
          topic: { type: "string" },
          preacherName: { type: "string" },
          verse: { type: "string" },
          date: { type: "string", format: "date-time" },
          imageUrl: { type: "string", nullable: true }
        }
      },
      Project: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          goalAmount: { type: "string" },
          amountReached: { type: "string" },
          startDate: { type: "string", format: "date-time" },
          endDate: { type: "string", format: "date-time" },
          imageUrl: { type: "string", nullable: true },
          status: { $ref: "#/components/schemas/ContentStatus" },
          createdById: { type: "string" },
          publishedAt: { type: "string", format: "date-time", nullable: true },
          publishedById: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      UpsertProjectRequest: {
        type: "object",
        required: ["title", "description", "goalAmount", "startDate", "endDate"],
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          goalAmount: { oneOf: [{ type: "string" }, { type: "number" }] },
          amountReached: { oneOf: [{ type: "string" }, { type: "number" }], nullable: true },
          startDate: { type: "string", format: "date-time" },
          endDate: { type: "string", format: "date-time" },
          imageUrl: { type: "string", nullable: true }
        }
      },
      BannerSlide: {
        type: "object",
        properties: {
          id: { type: "string" },
          bannerId: { type: "string" },
          imageUrl: { type: "string" },
          text: { type: "string", nullable: true },
          order: { type: "integer" }
        }
      },
      Banner: {
        type: "object",
        properties: {
          id: { type: "string" },
          status: { $ref: "#/components/schemas/ContentStatus" },
          createdById: { type: "string" },
          publishedAt: { type: "string", format: "date-time", nullable: true },
          publishedById: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          slides: { type: "array", items: { $ref: "#/components/schemas/BannerSlide" } }
        }
      },
      UpsertBannerRequest: {
        type: "object",
        required: ["slides"],
        properties: {
          slides: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              required: ["imageUrl", "order"],
              properties: {
                imageUrl: { type: "string" },
                text: { type: "string", nullable: true },
                order: { type: "integer", minimum: 0 }
              }
            }
          }
        }
      }
    }
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/auth/login": {
      post: {
        summary: "Login",
        tags: ["Auth"],
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginResponse" }
              }
            }
          },
          "400": { description: "Bad Request" },
          "401": { description: "Unauthorized" }
        }
      }
    },

    

    "/users": {
      get: {
        tags: ["Users"],
        summary: "List users (admin only)",
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/User" } }
              }
            }
          },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" }
        }
      }
    },

    "/users/{id}/role": {
      patch: {
        tags: ["Users"],
        summary: "Update user role (admin only)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateUserRoleRequest" }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" }
              }
            }
          },
          "400": { description: "Bad Request" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
          "404": { description: "Not Found" },
          "409": { description: "Conflict" }
        }
      }
    },

    "/events": {
      get: {
        tags: ["Events"],
        summary: "List events (admin/content-manager)",
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Event" } }
              }
            }
          },
          "401": { description: "Unauthorized" }
        }
      },
      post: {
        tags: ["Events"],
        summary: "Create event",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpsertEventRequest" }
            }
          }
        },
        responses: {
          "201": { description: "Created" },
          "400": { description: "Bad Request" },
          "401": { description: "Unauthorized" }
        }
      }
    },
    "/events/{id}": {
      get: {
        tags: ["Events"],
        summary: "Get event",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "OK" },
          "401": { description: "Unauthorized" },
          "404": { description: "Not Found" }
        }
      },
      put: {
        tags: ["Events"],
        summary: "Update event (owner/admin; not published)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpsertEventRequest" }
            }
          }
        },
        responses: {
          "200": { description: "OK" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
          "404": { description: "Not Found" },
          "409": { description: "Conflict" }
        }
      },
      delete: {
        tags: ["Events"],
        summary: "Delete event (owner/admin; published requires admin)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "204": { description: "No Content" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
          "404": { description: "Not Found" }
        }
      }
    },
    "/events/{id}/request-review": {
      post: {
        tags: ["Events"],
        summary: "Submit event for review (owner/admin; draft only)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "OK" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
          "404": { description: "Not Found" },
          "409": { description: "Conflict" }
        }
      }
    },
    "/events/{id}/reject": {
      post: {
        tags: ["Events"],
        summary: "Reject event (admin only; in review only)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "OK" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
          "404": { description: "Not Found" },
          "409": { description: "Conflict" }
        }
      }
    },
    "/events/{id}/publish": {
      post: {
        tags: ["Events"],
        summary: "Publish event (admin only)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "OK" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
          "404": { description: "Not Found" },
          "409": { description: "Conflict" }
        }
      }
    },

    "/announcements": {
      get: {
        tags: ["Announcements"],
        summary: "List announcements (admin/content-manager)",
        responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" } }
      },
      post: {
        tags: ["Announcements"],
        summary: "Create announcement",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpsertAnnouncementRequest" }
            }
          }
        },
        responses: { "201": { description: "Created" }, "400": { description: "Bad Request" }, "401": { description: "Unauthorized" } }
      }
    },
    "/announcements/{id}": {
      get: {
        tags: ["Announcements"],
        summary: "Get announcement",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" }, "404": { description: "Not Found" } }
      },
      put: {
        tags: ["Announcements"],
        summary: "Update announcement (owner/admin; not published)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpsertAnnouncementRequest" }
            }
          }
        },
        responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" }, "403": { description: "Forbidden" }, "404": { description: "Not Found" }, "409": { description: "Conflict" } }
      },
      delete: {
        tags: ["Announcements"],
        summary: "Delete announcement (owner/admin; published requires admin)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "204": { description: "No Content" }, "401": { description: "Unauthorized" }, "403": { description: "Forbidden" }, "404": { description: "Not Found" } }
      }
    },
    "/announcements/{id}/request-review": {
      post: {
        tags: ["Announcements"],
        summary: "Submit announcement for review (owner/admin; draft only)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" }, "403": { description: "Forbidden" }, "404": { description: "Not Found" }, "409": { description: "Conflict" } }
      }
    },
    "/announcements/{id}/reject": {
      post: {
        tags: ["Announcements"],
        summary: "Reject announcement (admin only; in review only)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" }, "403": { description: "Forbidden" }, "404": { description: "Not Found" }, "409": { description: "Conflict" } }
      }
    },
    "/announcements/{id}/publish": {
      post: {
        tags: ["Announcements"],
        summary: "Publish announcement (admin only)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" }, "403": { description: "Forbidden" }, "404": { description: "Not Found" }, "409": { description: "Conflict" } }
      }
    },

    "/services": {
      get: {
        tags: ["Services"],
        summary: "List services (admin/content-manager)",
        responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" } }
      },
      post: {
        tags: ["Services"],
        summary: "Create service",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpsertServiceRequest" }
            }
          }
        },
        responses: { "201": { description: "Created" }, "400": { description: "Bad Request" }, "401": { description: "Unauthorized" } }
      }
    },
    "/services/{id}": {
      get: {
        tags: ["Services"],
        summary: "Get service",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" }, "404": { description: "Not Found" } }
      },
      put: {
        tags: ["Services"],
        summary: "Update service (owner/admin; not published)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpsertServiceRequest" }
            }
          }
        },
        responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" }, "403": { description: "Forbidden" }, "404": { description: "Not Found" }, "409": { description: "Conflict" } }
      },
      delete: {
        tags: ["Services"],
        summary: "Delete service (owner/admin; published requires admin)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "204": { description: "No Content" }, "401": { description: "Unauthorized" }, "403": { description: "Forbidden" }, "404": { description: "Not Found" } }
      }
    },
    "/services/{id}/request-review": {
      post: {
        tags: ["Services"],
        summary: "Submit service for review (owner/admin; draft only)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" }, "403": { description: "Forbidden" }, "404": { description: "Not Found" }, "409": { description: "Conflict" } }
      }
    },
    "/services/{id}/reject": {
      post: {
        tags: ["Services"],
        summary: "Reject service (admin only; in review only)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" }, "403": { description: "Forbidden" }, "404": { description: "Not Found" }, "409": { description: "Conflict" } }
      }
    },
    "/services/{id}/publish": {
      post: {
        tags: ["Services"],
        summary: "Publish service (admin only)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" }, "403": { description: "Forbidden" }, "404": { description: "Not Found" }, "409": { description: "Conflict" } }
      }
    },

    "/projects": {
      get: {
        tags: ["Projects"],
        summary: "List projects (admin/content-manager)",
        responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" } }
      },
      post: {
        tags: ["Projects"],
        summary: "Create project",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpsertProjectRequest" }
            }
          }
        },
        responses: { "201": { description: "Created" }, "400": { description: "Bad Request" }, "401": { description: "Unauthorized" } }
      }
    },
    "/projects/{id}": {
      get: {
        tags: ["Projects"],
        summary: "Get project",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" }, "404": { description: "Not Found" } }
      },
      put: {
        tags: ["Projects"],
        summary: "Update project (owner/admin; not published)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpsertProjectRequest" }
            }
          }
        },
        responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" }, "403": { description: "Forbidden" }, "404": { description: "Not Found" }, "409": { description: "Conflict" } }
      },
      delete: {
        tags: ["Projects"],
        summary: "Delete project (owner/admin; published requires admin)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "204": { description: "No Content" }, "401": { description: "Unauthorized" }, "403": { description: "Forbidden" }, "404": { description: "Not Found" } }
      }
    },
    "/projects/{id}/request-review": {
      post: {
        tags: ["Projects"],
        summary: "Submit project for review (owner/admin; draft only)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" }, "403": { description: "Forbidden" }, "404": { description: "Not Found" }, "409": { description: "Conflict" } }
      }
    },
    "/projects/{id}/reject": {
      post: {
        tags: ["Projects"],
        summary: "Reject project (admin only; in review only)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" }, "403": { description: "Forbidden" }, "404": { description: "Not Found" }, "409": { description: "Conflict" } }
      }
    },
    "/projects/{id}/publish": {
      post: {
        tags: ["Projects"],
        summary: "Publish project (admin only)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" }, "403": { description: "Forbidden" }, "404": { description: "Not Found" }, "409": { description: "Conflict" } }
      }
    },

    "/banners": {
      get: {
        tags: ["Banners"],
        summary: "List banners (admin/content-manager)",
        responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" } }
      },
      post: {
        tags: ["Banners"],
        summary: "Create banner",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpsertBannerRequest" }
            }
          }
        },
        responses: { "201": { description: "Created" }, "400": { description: "Bad Request" }, "401": { description: "Unauthorized" } }
      }
    },
    "/banners/{id}": {
      get: {
        tags: ["Banners"],
        summary: "Get banner",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" }, "404": { description: "Not Found" } }
      },
      put: {
        tags: ["Banners"],
        summary: "Update banner (owner/admin; not published)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpsertBannerRequest" }
            }
          }
        },
        responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" }, "403": { description: "Forbidden" }, "404": { description: "Not Found" }, "409": { description: "Conflict" } }
      },
      delete: {
        tags: ["Banners"],
        summary: "Delete banner (owner/admin; published requires admin)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "204": { description: "No Content" }, "401": { description: "Unauthorized" }, "403": { description: "Forbidden" }, "404": { description: "Not Found" } }
      }
    },
    "/banners/{id}/request-review": {
      post: {
        tags: ["Banners"],
        summary: "Submit banner for review (owner/admin; draft only)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" }, "403": { description: "Forbidden" }, "404": { description: "Not Found" }, "409": { description: "Conflict" } }
      }
    },
    "/banners/{id}/reject": {
      post: {
        tags: ["Banners"],
        summary: "Reject banner (admin only; in review only)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" }, "403": { description: "Forbidden" }, "404": { description: "Not Found" }, "409": { description: "Conflict" } }
      }
    },
    "/banners/{id}/publish": {
      post: {
        tags: ["Banners"],
        summary: "Publish banner (admin only)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" }, "403": { description: "Forbidden" }, "404": { description: "Not Found" }, "409": { description: "Conflict" } }
      }
    },

    "/public/events": {
      get: {
        tags: ["Public"],
        summary: "List published events",
        security: [],
        responses: { "200": { description: "OK" } }
      }
    },
    "/public/announcements": {
      get: {
        tags: ["Public"],
        summary: "List published announcements",
        security: [],
        responses: { "200": { description: "OK" } }
      }
    },
    "/public/services": {
      get: {
        tags: ["Public"],
        summary: "List published services",
        security: [],
        responses: { "200": { description: "OK" } }
      }
    },
    "/public/projects": {
      get: {
        tags: ["Public"],
        summary: "List published projects",
        security: [],
        responses: { "200": { description: "OK" } }
      }
    },
    "/public/banners": {
      get: {
        tags: ["Public"],
        summary: "List published banners",
        security: [],
        responses: { "200": { description: "OK" } }
      }
    }
  }
} as const;
