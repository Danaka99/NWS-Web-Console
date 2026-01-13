module.exports = {
  keystone: {
    url: process.env.KEYSTONE_URL,
    adminUser: process.env.KEYSTONE_ADMIN_USER,
    adminPassword: process.env.KEYSTONE_ADMIN_PASSWORD,
    adminProject: process.env.KEYSTONE_ADMIN_PROJECT,
    domain: process.env.KEYSTONE_DOMAIN || 'default'
  },
  swift: {
    url: process.env.SWIFT_URL,
    authUrl: process.env.SWIFT_AUTH_URL || process.env.KEYSTONE_URL
  },
  cinder: {
    url: process.env.CINDER_URL
  },
  nova: {
    url: process.env.NOVA_URL
  }
};