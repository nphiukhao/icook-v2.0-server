const AllRecipeService = {
    getAllRecipes(db){
        return db 
            .from('recipe')
            .select('id', 'title', 'minutes', 'instructions', 'date_modified')
    },
    // getRecipeById(db, id){
    //     return db
    //         .from('recipe')
    //         .select('id', 'title', 'minutes', 'instructions', 'date_modified')
    //         .where('id', id)
    //         .first()
    // },
    getIngredById(db, id){
        return db
            .from('ingredient')
            .select('name') 
            .where('recipe_id', id)
            
    },
    inserNewRecipe(db, newRecipe){
        return db
            .insert(newRecipe)
            .into('recipe')
            .returning('*')
    },
    inserNewIngredients(db, newIngredientArray, next){
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
        console.log(min, max)
        return db
        .from('recipe')
        .select('id', 'title', 'minutes', 'instructions', 'date_modified')
        .whereBetween('minutes', [min, max])
        .returning('*')
            // .select('r.id', 'r.title', 'r.minutes', 'r.image', 'r.date_modified', 'i.recipe_id', 'i.name')
            // .from('recipe AS r')
            // .innerJoin('ingredient AS i', 'r.id', 'i.recipe_id')
            //.where('r.minutes', time????)

        
    }
        
}

module.exports = AllRecipeService