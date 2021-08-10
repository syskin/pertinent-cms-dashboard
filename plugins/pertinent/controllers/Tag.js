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
        
        const tagData = await strapi
            .query(`tag`, `pertinent`)
            .create({
                parent_id: data.parentId,
                wrapper_type: data.wrapperType, 
                wrapper_id: data.wrapperId, 
                type: data.type, 
                order: data.order, 
                depth: data.depth
            });

        ctx.send({ message: `Tag created successfully`, tag: tagData });
        } catch (e) {
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

        await strapi.query(`tag`, `pertinent`).delete({ id: params.id });

        ctx.send({ message: `Tag deleted successfully` });
        } catch (e) {
        return ctx.badRequest(`An error occured`);
        }
    },
};
