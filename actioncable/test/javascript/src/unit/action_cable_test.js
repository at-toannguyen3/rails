import * as ActionCable from "../../../../app/javascript/action_cable/index"
import {testURL} from "../test_helpers/index"

const {module, test} = QUnit

module("ActionCable", () => {
  module("Adapters", () => {
    module("WebSocket", () => {
      test("default is self.WebSocket", assert => {
        assert.equal(ActionCable.adapters.WebSocket, self.WebSocket)
      })
    })

    module("logger", () => {
      test("default is self.console", assert => {
        assert.equal(ActionCable.adapters.logger, self.console)
      })
    })
  })

  module("#createConsumer", () => {
    test("uses specified URL", assert => {
      const consumer = ActionCable.createConsumer(testURL)
      assert.equal(consumer.url, testURL)
    })

    test("uses default URL", assert => {
      const pattern = new RegExp(`${ActionCable.INTERNAL.default_mount_path}$`)
      const consumer = ActionCable.createConsumer()
      assert.ok(pattern.test(consumer.url), `Expected ${consumer.url} to match ${pattern}`)
    })

    test("uses URL from meta tag", assert => {
      const element = document.createElement("meta")
      element.setAttribute("name", "action-cable-url")
      element.setAttribute("content", testURL)

      document.head.appendChild(element)
      const consumer = ActionCable.createConsumer()
      document.head.removeChild(element)

      assert.equal(consumer.url, testURL)
    })

    test("uses function to generate URL", assert => {
      let dynamicURL = testURL
      const generateURL = () => {
        return dynamicURL
      }

      dynamicURL = `${testURL}foo`
      const consumer = ActionCable.createConsumer(generateURL)
      assert.equal(consumer.url, `${testURL}foo`)
    })
  })
})
