// import request from "supertest";
// import app from "@/app/page";

// describe("POST /api/generate-image", () => {
//   it("should generate an image successfully", async () => {
//     const response = await request(app).post("/api/generate-image").send({
//       prompt: "Generate an image of a sunset",
//       size: "1024x768"
//     });

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty("imageUrl");
//   });

//   it("should return 400 for invalid input", async () => {
//       prompt: "",
//       size: "invalid-size"
//       /* payload inválido */
//     });

//     expect(response.status).toBe(400);
//   });
// });
