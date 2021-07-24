module.exports = async () => {
  try {
    const permOrm = strapi.query(`permission`, `users-permissions`);
    const pluginPermissions = await permOrm.find({ type: `pertinent` });
    for (const currentPermission of pluginPermissions) {
      /*
      if (currentPermission.role.type === `authenticated`) {
        strapi.log.info(
          `Allowing authenticated to call ${currentPermission.controller}.${currentPermission.action}`
        );
        permOrm.update(
          { id: currentPermission.id },
          { ...currentPermission, enabled: true }
        );
        continue;
      }
      // permission is for public - commentend until authentication will be setup in the Studio
      // const isReadEndpoint = [`path`].includes(currentPermission.action);
      const isReadEndpoint = true
      if (isReadEndpoint) {
      */
      strapi.log.info(
        `Allowing public to call ${currentPermission.controller}.${currentPermission.action}`
      );
      permOrm.update(
        { id: currentPermission.id },
        { ...currentPermission, enabled: true }
      );
      continue;
    }

    const homePage = await strapi
      .query(`pages`, `pertinent`)
      .find({ slug: `/` });
    if (homePage.length === 0) {
      const data = {
        name: `Home`,
        slug: `/`,
        isDeletable: false,
      };
      await strapi.query(`pages`, `pertinent`).create(data);
      strapi.log.info(`Home page was successfully created.`);
    }
  } catch (e) {
    strapi.log.error(`An error occured : `, e);
  }
};
