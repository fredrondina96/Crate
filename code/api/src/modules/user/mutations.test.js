import request from 'supertest';
import express from 'express';
import graphqlHTTP from 'express-graphql'
import schema from '../../setup/schema'
import models from '../../setup/models'
import bcrypt from 'bcrypt';
import db from '../../setup/database';

describe("user mutations", () => {
  let server = express();

  beforeAll(async() => {
    server.use(
      '/',
      graphqlHTTP({
        schema: schema,
        graphiql: false
      })
    );
    await models.User.destroy({ where: {}})
  });

  beforeEach(async() => {
    const userData1 = {
      id: 1,
      name: "testUser1",
      email: "test@example.com",
      password: bcrypt.hashSync('abc123', 10),
      role: "USER",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await models.User.create(userData1);
  })

  afterEach(async() => {
    await models.User.destroy({ where: {}})
  })

  afterAll(() => {
    db.close()
  })

  it ("can update a user's style summary from a style survey multiple times", async() => {
    const data = {
      query: `mutation {
        userStyleSummaryUpdate(
          id: 1,
          styleSurvey: ["comfy", "comfy", "punk", "punk", "comfy"]
        )
        { styleSummary }
      }`
    }

    const response1 = await request(server)
      .post('/')
      .send(data)
      .expect(200)

    expect(response1.body.data.userStyleSummaryUpdate.styleSummary).toEqual("comfy, but punk")

    const new_data = {
      query: `mutation {
        userStyleSummaryUpdate(
          id: 1,
          styleSurvey: ["prep", "comfy", "prep", "prep", "comfy"]
        )
        { styleSummary }
      }`
    }

    const response2 = await request(server)
      .post('/')
      .send(new_data)
      .expect(200)

    expect(response2.body.data.userStyleSummaryUpdate.styleSummary).toEqual("prep, but comfy")
  })

  it ("can update a user's style summary if there is only one style selected [edge case]", async() => {
    const data = {
      query: `mutation {
        userStyleSummaryUpdate(
          id: 1,
          styleSurvey: ["comfy", "comfy", "comfy", "comfy", "comfy"]
        )
        { styleSummary }
      }`
    }

    var response = await request(server)
      .post('/')
      .send(data)
      .expect(200)

    expect(response.body.data.userStyleSummaryUpdate.styleSummary).toEqual("comfy")
  })
})
