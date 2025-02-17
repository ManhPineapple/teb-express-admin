const AVG_TIME_INPUT = 50

export default {
  data() {
    return {
      input_stack: [],
      last_input_time: null,
      avg_time_input_threshold: AVG_TIME_INPUT,
      avg_input_time: AVG_TIME_INPUT,
      detecting_scanning: true,
    }
  },
  mounted() {
    this.initBarcodeListener()
  },
  destroyed() {
    document.onkeyup = null
    document.onkeydown = null
  },
  methods: {
    resetStack() {
      this.setInputStack([])
    },
    resetAvgInputTime() {
      this.setAvgInputTime(this.avg_time_input_threshold)
    },
    setInputStack(value) {
      this.input_stack = value
    },
    addToInputStack(value) {
      this.input_stack.push(value)
    },
    setLastInputTime(value) {
      this.last_input_time = value
    },
    setAvgInputTime(value) {
      this.avg_input_time = value
    },
    setDetectingScanning(value) {
      this.detecting_scanning = value
    },
    destroyEvenListener() {
      document.onkeyup = null
      document.onkeydown = null
    },
    initBarcodeListener() {
      //fire on key press down
      document.onkeydown = () => {
        this.setLastInputTime(Date.now())
      }

      //fire on key press up
      document.onkeyup = (e) => {
        //get key from keypress
        e = e || window.event
        const key = e.key

        //check if numerical, stop event handler if not numerical
        if (key.length > 1 && key !== 'Enter') {
          return
        }
        if (!this.detecting_scanning) {
          this.detecting_scanning = true
          this.setInputStack([])
          this.resetAvgInputTime()
        }
        //get current time
        const currentInputTime = Date.now()

        //check and see if avg time between inputs breaks the input threshold
        const timeBetweenInputs = currentInputTime - this.last_input_time
        this.setAvgInputTime((this.avg_input_time + timeBetweenInputs) / 2)

        //if it is currently scanning or the average time passes the threshold test, continue
        if (
          this.detecting_scanning &&
          this.avg_input_time < this.avg_time_input_threshold
        ) {
          //set mode to currently scanner and add the given key value to the stack
          this.setDetectingScanning(true)
          key !== 'Enter' && this.addToInputStack(key)

          //after a time, check if we have received any more input in a while
          // also, check if currently in scanning mode (prevents the settimeouts from overlapping eachother)
          key === 'Enter' && this.listenNextCharacter()
        } else {
          //rest the avg input time and pass the keypress into the first element of the input stack
          this.setInputStack([])
          this.resetAvgInputTime()
        }
      }
    },
    listenNextCharacter() {
      setTimeout(() => {
        if (
          this.detecting_scanning &&
          this.last_input_time - Date.now() < this.avg_time_input_threshold
        ) {
          //shut down scanner detection mode
          this.setDetectingScanning(false)

          if (this.input_stack.length >= 2) {
            //DO ACTION HERE
            let keyword = this.input_stack.join('')
            this.barcodeSubmit(keyword)
          }

          //reset scanner-detection-state-dependent constiables
          this.resetStack()
          this.resetAvgInputTime()
        }
      }, 200)
    },
  },
}
