const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe(`Ingredient endpoint`, function () {
    let db

    const {
        testUsers,
        testIngre,

    } = helpers.makeThingsFixtures()

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`POST /recipe`, () => {
        beforeEach(`insert things`, () =>
            helpers.seedUsers(
                db,
                testUsers
            )
        )

        it(`creates a recipe, responding with 201 and the new recipe`, () => {
            this.retries(3)
            const newRecipe = {
                title: 'Test new recipe',
                minutes: 3,
                instructions: 'new recipe instructions',
                ingredient: 'test-i1, test-i2, test-i3'
            }

            return supertest(app)
                .post('/add')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(newRecipe)
                .expect(201)
                .expect(res => {

                    expect(res.body.recipe[0]).to.have.property('id')
                    expect(res.body.recipe[0].title).to.eql(newRecipe.title)
                    expect(res.body.recipe[0].minutes).to.eql(newRecipe.minutes)
                    expect(res.body.recipe[0].instructions).to.eql(newRecipe.instructions)
                    expect(res.body.ingredient).to.eql([{ id: 1, name: 'test-i1', recipe_id: 1 },
                    { id: 2, name: 'test-i2', recipe_id: 1 },
                    { id: 3, name: 'test-i3', recipe_id: 1 }])



                })
                .expect(res =>
                    db
                        .from('recipe')
                        .select('*')
                        .where({ id: res.body.recipe[0].id })
                        .first()
                        .then(row => {
                            expect(row.title).to.eql(newRecipe.title)
                            expect(row.minutes).to.eql(newRecipe.minutes)
                            expect(row.instructions).to.eql(newRecipe.instructions)
                        })

                )

        })
    })
})