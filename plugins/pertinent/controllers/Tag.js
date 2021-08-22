"use strict";
/**
 * tag.js controller
 *
 * @description: A set of functions called "actions" of the `tags` plugin.
 */

module.exports = {
    /**
     * Get tags.
     *
     * @return {Object}
     */
    get: async (ctx) => {
        try {
            const filter = ctx.request.query
            const tagsData = await strapi
            .query(`tag`, `pertinent`)
            .find({
                wrapper_id: filter.wrapperId,
                wrapper_type: filter.wrapperType
            });

            ctx.send(tagsData);
        } catch (e) {
            return ctx.badRequest(`An error occured`);
        }
    },

    /**
     * Create a tag.
     *
     * @return {Object}
     */
    create: async (ctx) => {
        try {
            const data = ctx.request.body;
            const {parent_id, wrapper_type, wrapper_id, type, order, depth} = data

            const tagData = await strapi
            .query(`tag`, `pertinent`)
            .create({
                parent_id,
                wrapper_type, 
                wrapper_id, 
                type, 
                order, 
                depth,
            });

            ctx.send({ message: `Tag created successfully`, tag: tagData });
        } catch (e) {
            console.log(e)
            return ctx.badRequest(`An error occured`);
        }
    },

    /**
     * Update tag by id.
     *
     * @return {Object}
     */
    update: async (ctx) => {
        try {
        const params = ctx.params;
        const body = ctx.request.body;
        const result = await strapi
            .query(`tag`, `pertinent`)
            .findOne({ id: params.id });

        if (!result) return ctx.badRequest(`This tag does not exists`);

        const updateData = await strapi
            .query(`tag`, `pertinent`)
            .update(params, body);

        ctx.send({ message: `Tag data updated`, tag: updateData });
        } catch (e) {
        return ctx.badRequest(`An error occured`);
        }
    },

    /**
     * Delete tag by id.
     *
     * @return {Object}
     */
    delete: async (ctx) => {
        try {
        const params = ctx.params;

        const tagToDelete = await strapi.query(`tag`, `pertinent`).findOne({id: params.id});
        const tags = await strapi.query(`tag`, `pertinent`).find({ wrapper_id: tagToDelete.wrapper_id, wrapper_type: tagToDelete.wrapper_type });
        
        const tagsIdToDelete = await getAllChildIds(tagToDelete.id, tags);
        tagsIdToDelete.push(tagToDelete.id)
        await strapi.query(`tag`, `pertinent`).delete({id_in: tagsIdToDelete});

        ctx.send({ message: `Tag deleted successfully` });
        } catch (e) {
            console.log(e)
            return ctx.badRequest(`An error occured`);
        }
    },
};


function getAllChildIds(tagIdToDelete, tags){
    let ids = []
    const children = tags.filter(tag => tagIdToDelete === tag.parent_id)
    
   children.map(child => {
       const checkChildren = tags.filter(tag => child.id === tag.parent_id)
        if(checkChildren && checkChildren.length > 0 ) {
            ids = [...ids, ...getAllChildIds(child.id, tags)]
        }
        ids.push(child.id)
    })
    return ids
}
