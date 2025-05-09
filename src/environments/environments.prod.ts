export const environment = {
  production: true,
  rapidApi: {
    key: process.env['RAPID_API_KEY'] || '',
    host: process.env['RAPID_API_HOST'] || ''
  }
};