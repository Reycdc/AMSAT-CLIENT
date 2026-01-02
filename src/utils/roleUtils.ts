
export const getUserRolePath = (user: any): string => {
    if (!user || !user.roles || user.roles.length === 0) return 'member';

    const roles = user.roles.map((r: any) => r.name.toLowerCase());

    if (roles.includes('superadmin') || roles.includes('admin')) return 'admin';
    if (roles.includes('redaktur')) return 'redaktur';
    if (roles.includes('author')) return 'author';

    return 'member';
};

export const ALIAS_ROLES = ['admin', 'author', 'redaktur', 'member'];
