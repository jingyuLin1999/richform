// module.exports = {
//   presets: [
//     '@vue/cli-plugin-babel/preset'
//   ]
// }

module.exports = {
  presets: [
    ['@vue/app', {
      polyfills: [
        'es.array.iterator', 'es.promise', 'es.object.assign', 'es.promise.finally'
      ]
    }]
  ]
}
