import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc, userAc } from "better-auth/plugins/admin/access";

export const ac = createAccessControl(defaultStatements);

/** Full admin permissions (same as the plugin’s built-in admin role). */
export const adminRole = ac.newRole({
	...adminAc.statements,
});

/** Non-admin users: no admin-plugin permissions (same as the built-in “user” role, named “student” here). */
export const studentRole = ac.newRole({
	...userAc.statements,
});
