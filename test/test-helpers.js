const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
    return [
        {
            id: 1,
            user_name: 'test-user-1',
            password: 'password',
            date_modified: '2029-01-22T16:28:32.615Z',
        },
        {
            id: 2,
            user_name: 'test-user-2',
            password: 'password',
            date_modified: '2029-01-22T16:28:32.615Z',
        }
    ]
}

function makeRecipesArray() {
    return [
        {
            id: 1,
            title: 'First test recipe!',
            minutes: 20,
            date_modified: '2029-01-22T16:28:32.615Z',
            instructions: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
        },
        {
            id: 2,
            title: 'Second test recipe!',
            minutes: 28,
            date_modified: '2029-01-22T16:28:32.615Z',
            instructions: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
        },
        {
            id: 3,
            title: 'Third test recipe!',
            minutes: 40,
            date_modified: '2029-01-22T16:28:32.615Z',
            instructions: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
        },
        {
            id: 4,
            title: 'Fourth test recipe!',
            minutes: 50,
            date_modified: '2029-01-22T16:28:32.615Z',
            instructions: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
        },
    ]
}

function makeIngreArray(recipe) {
    return [
        {
            id: 1,
            name: 'First ingredient',
            recipe_id: recipe[0].id,
        },
        {
            id: 2,
            name: 'second ingredient',
            recipe_id: recipe[0].id,
        },
        {
            id: 1,
            name: 'third ingredient!',
            recipe_id: recipe[0].id,
        },
        {
            id: 1,
            name: 'fourth ingredient!',
            recipe_id: recipe[0].id,
        },
    ];
}


function makeExpectedRecipe(recipe) {

  return {
    id: recipe.id,
    title: recipe.title,
    minutes: recipe.minutes,
    date_modified: recipe.date_modified,
    instructions: recipe.instructions
  }
}

// function calculateAverageReviewRating(reviews) {
//   if(!reviews.length) return 0

//   const sum = reviews
//     .map(review => review.rating)
//     .reduce((a, b) => a + b)

//   return Math.round(sum / reviews.length)
// }

// function makeExpectedThingReviews(users, thingId, reviews) {
//   const expectedReviews = reviews
//     .filter(review => review.thing_id === thingId)

//   return expectedReviews.map(review => {
//     const reviewUser = users.find(user => user.id === review.user_id)
//     return {
//       id: review.id,
//       text: review.text,
//       rating: review.rating,
//       date_created: review.date_created,
//       user: {
//         id: reviewUser.id,
//         user_name: reviewUser.user_name,
//         full_name: reviewUser.full_name,
//         nickname: reviewUser.nickname,
//         date_created: reviewUser.date_created,
//       }
//     }
//   })
// }

function makeMaliciousRecipe(user) {
  const maliciousRecipe = {
    id: 911,
    date_modified: new Date().toISOString(),
    minutes: 911,
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    instructions: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
  }
  const expectedRecipe = {
    ...makeExpectedRecipe([user], maliciousRecipe),
    title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    instructions: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  }
  return {
    maliciousRecipe,
    expectedRecipe,
  }
}

function makeThingsFixtures() {
    const testUsers = makeUsersArray()
    const testRecipes = makeRecipesArray()
    const testIngre = makeIngreArray(testRecipes)
    return { testUsers, testRecipes, testIngre}
}

function cleanTables(db) {
    return db.raw(
        `truncate 
        recipe,
        ingredient,
        users
        RESTART IDENTITY CASCADE`
    )
}


function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }))
    //console.log(preppedUsers)
    return db.into('users').insert(preppedUsers)
        .then(() =>
            // update the auto sequence to stay in sync
            db.raw(
                `SELECT setval('users_id_seq', ?)`,
                [users[users.length - 1].id],
            )
        )
}

function seedThingsTables(db, users, recipes, ingre = []) {

    return db.transaction(async trx => {
        await seedUsers(trx, users)
        await trx.into('recipe').insert(recipes)
        await trx.raw(
            `SELECT setval('recipe_id_seq', ?)`,
            [recipes[recipes.length - 1].id]
        )
        // only insert reviews if there are some
        if (ingre.length) {
            await trx.into('ingredient').insert(ingre)
            await trx.raw(
                `SELECT setval('ingredient_id_seq', ?)`,
                [ingre[ingre.length - 1].id]
            )
        }
    })
}

function seedMaliciousRecipe(db, user, recipe) {
  return seedUsers(db, [user])
    .then(() =>
      db
        .into('recipe')
        .insert([recipe])
    )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    // const token = Buffer.from(`${user.user_name}:${user.password}`).toString('base64')
    const token = jwt.sign({user_id: user.id}, secret, {
      subject: user.user_name,
      algorithm: 'HS256'
    })
    return `Bearer ${token}`
  }

module.exports = {
    makeUsersArray,
    makeRecipesArray,
    makeExpectedRecipe,
    //   makeExpectedThingReviews,
    makeMaliciousRecipe,
    makeIngreArray,
    seedUsers,

    makeThingsFixtures,
    cleanTables,
    seedThingsTables,
    seedMaliciousRecipe,
    makeAuthHeader,
}
