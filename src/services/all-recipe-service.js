const xss = require('xss')
const Treeize = require('treeize')


const AllRecipeService = {
    getAllRecipes(db){
        return db 
            .from('recipe')
            .select('id', 'title', 'minutes', 'instructions', 'date_modified')
    },
    getRecipeById(db, id){
        return db
            .from('recipe')
            .select('id', 'title', 'minutes', 'instructions', 'date_modified')
            .where('id', id)
            .first()
    },
    getIngredById(db, id){
        return db
            .from('ingredient')
            .select('name') 
            .where('recipe_id', id)
            
    },
    insertNewRecipe(db, newRecipe){
        return db
            .insert(newRecipe)
            .into('recipe')
            .returning('*')
    },
    insertNewIngredients(db, newIngredientArray){
        return db
            .insert(newIngredientArray)
            .into('ingredient')
            .returning('*')
    },
    getRecipeByTime(db, time){
        let min 
        let max
        if(time == 25) {
           min = 0
           max = 25
        }
        if(time == 35) {
            min = 25
            max = 35
         }
        if(time == 45){
            min = 35
            max = 45
        }
        if(time == 55){
            min = 45
            max = 55
        }
        return db
        .from('recipe')
        .select('id', 'title', 'minutes', 'instructions', 'date_modified')
        .whereBetween('minutes', [min, max])
        .returning('*')

    },
    getMatch(db, ingred){
        return db.raw(`WITH result as (
            select
            r.title, i.recipe_id, i.name
            from
            recipe r join ingredient i on r.id = i.recipe_id
            where i.name in (${ingred})
        ) SELECT
          title,
          recipe_id,
          count(*)
        FROM result group by title, recipe_id order by count(*) DESC;`)
    },
    deleteRecipe(db, id){
        return db
            .from('recipe')
            .delete()
            .where('id', id)
    },
    deleteIngredient(db, id){
        return db
            .from('ingredient')
            .delete()
            .where('id', id)
    },
    updateMinutes(db, id, newMins){
        return db
            .from('recipe')
            .where('id', id)
            .update({
                minutes: newMins
            })
    },

    serializeRecipes(recipes){
        return recipes.map(this.serializeRecipe)
    },

    serializeRecipe(recipe){
        const recipeTree = new Treeize()

        const recipeData = recipeTree.grow([recipe]).getData()[0]

        return {
            id: recipeData.id,
            title: xss(recipeData.title),
            minutes: recipeData.minutes,
            date_modified: recipeData.date_modified,
            instructions: xss(recipeData.instructions)
        }
    },
    serializeIngres(ingres) {
        return ingres.map(this.serializeIngre)
    },

    serializeIngre(ingre){
        const ingreTree = new Treeize()
        const ingreData = ingreTree.grow([ingre]).getData()[0]
        return {
            id: ingreData.id,
            name: xss(ingreData.name),
            recipe_id: ingreData.recipe_id
        }
    }
        
}

module.exports = AllRecipeService