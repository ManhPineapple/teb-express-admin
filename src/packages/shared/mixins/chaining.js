export default {
  methods: {
    $evaluate: (param) => eval('this.' + param),
  },
}
