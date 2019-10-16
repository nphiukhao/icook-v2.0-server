const AllRecipeService = {
    getAllRecipes(db){
        return db 
            .from('recipe')
            .select('id', 'title', 'minutes', 'image', 'date_modified')
    },
    getRecipeById(db, id){
        return db
            .select('r.id', 'r.title', 'r.minutes', 'r.image', 'r.date_modified', 'i.recipe_id', 'i.name')
            .from('recipe AS r')
            .innerJoin('ingredient AS i', 'r.id', 'i.recipe_id')
            .where('r.id', id)
    },
    inserNewRecipe(db, newRecipe){
        return db
            .insert(newRecipe)
            .into('recipe')
            .returning('*')
    },
    inserNewIngredient(db, newIngredient){
        return db
            .insert(newIngredient)
            .into('ingredient')
            .returning('*')
    },
    inserNewIngredients(db, newIngredientArray, next){
        return db
            .insert(newIngredientArray)
            .into('ingredient')
            .returning('*')
    }
        
}

module.exports = AllRecipeService