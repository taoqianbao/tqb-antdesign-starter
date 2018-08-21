'use strict';
module.exports = {
  Query: {
    role(root,{proleId,page,size} ,ctx) {
      let roleList = ctx.connector.role.getRoleList(proleId,page,size);
      let roleCount = ctx.connector.role.getRoleCount(proleId); 

      return {
          count:roleCount,
          rolelist:roleList,
      };
    },

    allrole(root,{},ctx){
        let roleList = ctx.connector.role.getAllRoles();
        return roleList;
    },

    roleMenus(root,{roleId} ,ctx) {
        let roleMenus = ctx.connector.role.getRoleMenus(roleId);
        return roleMenus;
    },
  },

  Mutation: {
    createRole(root, {
        roleInput
    }, ctx) {
        ctx.service.role.add('frole',{
            name:roleInput.name,
            proleId:roleInput.proleId,
        });
        return true;
    },

    deleteRole(root, {
        roleId
    }, ctx) {
        ctx.service.role.delete('frole',{roleId:roleId})
        return true;
    },

    updateRole(root, {
        roleId,roleInput
    }, ctx) {
        ctx.service.role.update('frole',roleInput,{roleId:roleId});
        return true;
    },

    configRoleMenu(root, {
        roleId,
        roleMenus
      }, ctx) {
          let data = {
            roleId:roleId,
            menus:roleMenus
          }
          ctx.service.role.configRoleMenu(data);
          return true;
    },
  },
};