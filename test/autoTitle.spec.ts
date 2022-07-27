import { autoTitle } from "../src/autoTitle";
import chai from "chai/chai.js";
const expect = chai.expect;

describe("autoTitle", function() {
  it("should auto title paths", function() {
    expect(autoTitle('../button/src/index.stories.tsx')).to.equal('button');
    expect(autoTitle('../../button/button.stories.tsx')).to.equal('button');
    expect(autoTitle('/button/stories/index.stories.tsx')).to.equal('button');
    expect(autoTitle('./stories/index.stories.tsx')).to.equal('');
  });
});
