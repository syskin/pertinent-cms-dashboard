"use strict";
/**
 * pages.js controller
 *
 * @description: A set of functions called "actions" of the `pages` plugin.
 */

module.exports = {
  /**
   * Default action.
   *
   * @return {Object}
   */
  meta: async (ctx) => {
    try {
      const result = await strapi.query(`page`, `pertinent`).find();
      const pages = [];
      if (result && result.length > 0) {
        const allowed = [
          `id`,
          `isDeletable`,
          `name`,
          `slug`,
          `description`,
          `updatedAt`,
          `createdAt`,
        ];
        result.forEach((page) => {
          const meta = Object.keys(page)
            .filter((key) => allowed.includes(key))
            .reduce((obj, key) => {
              obj[key] = page[key];
              return obj;
            }, {});
          pages.push(meta);
        });
      }

      ctx.send(pages);
    } catch (e) {
      return ctx.badRequest(`An error occured`);
    }
  },

  /**
   * Default action.
   *
   * @return {Object}
   */
  getById: async (ctx) => {
    try {
      const params = ctx.params;
      const result = await strapi
        .query(`page`, `pertinent`)
        .findOne({ id: params.id });

      let pageData = {};
      const allowed = [
        `id`,
        `title`,
        `description`,
        `isDeletable`,
        `name`,
        `slug`,
        `updatedAt`,
        `createdAt`,
      ];

      if (result)
        pageData = Object.keys(result)
          .filter((key) => allowed.includes(key))
          .reduce((obj, key) => {
            obj[key] = result[key];
            return obj;
          }, {});

      ctx.send(pageData);
    } catch (e) {
      return ctx.badRequest(`An error occured`);
    }
  },

  /**
   * Default action.
   *
   * @return {Object}
   */
  slug: async (ctx) => {
    try {
      const data = ctx.request.body;

      if (!data.slug) {
        return ctx.badRequest(`Slug must be defined`);
      }

      const pageData = await strapi
        .query(`page`, `pertinent`)
        .findOne({ slug: data.slug });

      if(!pageData) return ctx.badRequest(`This page doesn't exists`);

      ctx.send(pageData);
    } catch (e) {
      return ctx.badRequest(`An error occured`);
    }
  },

  /**
   * Default action.
   *
   * @return {Object}
   */
  create: async (ctx) => {
    try {
      const data = ctx.request.body;

      if (!data.name || !data.slug) {
        return ctx.badRequest(`Slug and name must be defined`);
      }

      const checkExistingPages = await strapi
        .query(`page`, `pertinent`)
        .count({ _or: [{ name: data.name }, { slug: data.slug }] });

      if (checkExistingPages && checkExistingPages > 0) {
        return ctx.badRequest(`Page already exists`);
      }

      const pageData = await strapi
        .query(`page`, `pertinent`)
        .create(data);

      ctx.send({ message: `Page created successfully`, page: pageData });
    } catch (e) {
      return ctx.badRequest(`An error occured`, e);
    }
  },

  /**
   * Update page by id.
   *
   * @return {Object}
   */
  update: async (ctx) => {
    try {
      const params = ctx.params;
      const body = ctx.request.body;
      const result = await strapi
        .query(`page`, `pertinent`)
        .findOne({ id: params.id });

      if (!result) return ctx.badRequest(`No page found`);

      const {name, slug, description} = body;

      const updateData = await strapi
        .query(`page`, `pertinent`)
        .update(params, {name, slug, description});

      ctx.send({ message: `Page data updated`, page: updateData });
    } catch (e) {
      return ctx.badRequest(`An error occured`);
    }
  },

  /**
   * Delete page by id.
   *
   * @return {Object}
   */
  delete: async (ctx) => {
    try {
      const params = ctx.params;
      const result = await strapi
        .query(`page`, `pertinent`)
        .findOne({ id: params.id });

      if (!result) return ctx.badRequest(`No page found`);

      if (!result.isDeletable)
        return ctx.badRequest(`This page is not deletable`);

      await strapi.query(`page`, `pertinent`).delete({ id: params.id });

      ctx.send({ message: `Page deleted successfully` });
    } catch (e) {
      return ctx.badRequest(`An error occured`);
    }
  },
};
