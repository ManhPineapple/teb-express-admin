<template>
  <ul
    class="vs-crumbs"
    v-if="crumbs.length"
    style="list-style:none; margin:0; padding:0; display:inline-block;"
  >
    <li :key="i" v-for="(crumb, i) in crumbs" style="display:inline-block">
      <router-link v-if="i < crumbs.length - 1" :to="crumb.path"
        >{{ crumb.name }}
        <IconArrorRight />
      </router-link>
      <span class="last" v-else style="cursor:default">{{ crumb.name }}</span>
    </li></ul
  >
</template>

<script>
import IconArrorRight from './arrow right.svg'

export default {
  name: 'VsCrumbs',
  components: { IconArrorRight },
  props: { root: String },
  computed: {
    crumbs: function() {
      var path = '',
        title = this.root || 'home'

      var cs = [{ name: title, path: '/' }]
      if (!this.$route) return []

      var r = this.$route.path.split('/')
      var m = (this.$route.matched[0].meta.crumbs || '').split('/')

      for (var i = 1; i < r.length; i++) {
        var name = m[i] || r[i]
        if (r[i] == '') continue

        title += ' : ' + name
        path += '/' + name

        cs.push({ name: name, path: path })
      }

      window.document.title = title

      return cs
    },
  },
}
</script>
<style lang="scss">
.vs-crumbs {
  height: 54px;
  line-height: 54px;
  img {
    padding: 0 14px;
  }
  width: 100%;
  border-bottom: 1px solid #dfe3e8;
}
</style>
