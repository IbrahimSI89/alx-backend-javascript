const assert = require('assert');
const calculateNumber = require('./0-calcul');
const { describe, it } = require('mocha');

describe('calculateNumber', function() {
  it('should return the sum of rounded numbers', function() {
    assert.strictEqual(calculateNumber(1, 3), 4);
    assert.strictEqual(calculateNumber(1, 3.7), 5);
    assert.strictEqual(calculateNumber(1.2, 3.7), 5);
    assert.strictEqual(calculateNumber(1.5, 3.7), 6);
  });
  
  it('should handle negative numbers', function() {
    assert.strictEqual(calculateNumber(-1, -3), -4);
    assert.strictEqual(calculateNumber(-1.3, -3.7), -5);
  })

  it('should handle mixed positive and negative numbers', function() {
    assert.strictEqual(calculateNumber(-1, 3), 2);
    assert.strictEqual(calculateNumber(1.3, -3.7), -3);
  })

  it('should handle zero correctly', function() {
    assert.strictEqual(calculateNumber(0, 0), 0);
    assert.strictEqual(calculateNumber(0, 1.5), 2);
    assert.strictEqual(calculateNumber(-0.5, 0.5), 1);
  })

})