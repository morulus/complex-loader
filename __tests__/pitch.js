const path = require('path')
const loader = require('../src/index.js');

const mockContext = {
  loader: {
    _module: {
      NormalModule: {
        issuer: {
          ContextModule: {
            debugId: 36,
            regExp: /\.js$/,
          }
        }
      }
    }
  }
}

const invokePath = require.resolve(`../invoke.js`);

const projectRoot = path.resolve(__dirname, '../')

function cutSpaces(str) {
  return str.replace(/[\s\n\r\t]*/g, '');
}

describe('Test pitch output', () => {
  it('All loaders is string', () => {
    const context = {
      ...mockContext,
      query: {
        alfa: 'alfa-loader',
        beta: 'beta-loader'
      },
      resourcePath: './index.js'
    }
    const result = loader.pitch.call(
      context
    )
    expect(cutSpaces(result)).toBe(`module.exports={[\"alfa\"]:require('!alfa-loader!./index.js'),[\"beta\"]:require('!beta-loader!./index.js')}`);
  });

  it('Loader is array of strings', () => {
    const context = {
      ...mockContext,
      query: {
        alfa: ['alfa-loader', 'beta-loader'],
      },
      resourcePath: './index.js'
    }
    const result = loader.pitch.call(
      context
    )
    expect(cutSpaces(result)).toBe(`module.exports={[\"alfa\"]:require('!alfa-loader!beta-loader!./index.js')}`);
  });

  it('Loader is array of objects', () => {
    const context = {
      ...mockContext,
      query: {
        alfa: [{
          loader: 'loader-utils',
          options: {
            a: 1
          }
        }, {
          loader: 'jest',
          options: {
            b: 1
          }
        }],
      },
      resourcePath: './index.js'
    }
    const result = loader.pitch.call(
      context
    )
    expect(cutSpaces(result)).toBe(`module.exports={[\"alfa\"]:require('!${invokePath}?options=000000/0/loader-utils/ca1a41f90da606b052ecf10c8286817813bc8861&loader=${projectRoot}/node_modules/loader-utils/lib/index.js&cache!${invokePath}?options=000000/1/jest/3a7c58594922037a57ade83233ac601f3239a806&loader=${projectRoot}/node_modules/jest/build/jest.js&cache!./index.js')}`);
  });

  it('Loader is object, but without options', () => {
    const context = {
      ...mockContext,
      query: {
        alfa: {
          loader: 'single-loader',
        },
      },
      resourcePath: './index.js'
    }
    const result = loader.pitch.call(
      context
    )
    expect(cutSpaces(result)).toBe(`module.exports={[\"alfa\"]:require('!single-loader!./index.js')}`);
  });

  it('Loaders is string, but options is object', () => {
    const context = {
      ...mockContext,
      query: {
        alfa: {
          /* I use loader-utils, because it always exists in current package, but this package is not a loader  */
          loader: 'loader-utils',
          options: {
            notALoader: true
          }
        }
      },
      resourcePath: './index.js'
    }
    const result = loader.pitch.call(
      context
    )
    expect(cutSpaces(result)).toBe(`module.exports={[\"alfa\"]:require('!${invokePath}?options=000000/alfa/loader-utils/f15f5ae913ceb372b2a3fcc536da3aa0735a6c2b&loader=${projectRoot}/node_modules/loader-utils/lib/index.js&cache!./index.js')}`);
  });
});

describe('Test invalidate', () => {
  it('Invalid loader format', () => {
    const emitError = jest.fn((e) => {
      expect(e.message).toBe('Invalid loader type boolean');
    });
    const context = {
      ...mockContext,
      query: {
        alfa: 'alfa-loader',
        beta: true // Invalid loader value
      },
      resourcePath: './index.js',
      emitError: emitError
    }
    const result = loader.pitch.call(
      context
    )
    expect(emitError).toHaveBeenCalled();
  });

  /* Loader passed as object, but loader is not defined */
  it('Invalid loader definition', () => {
    const emitError = jest.fn((e) => {
      expect(e.message).toBe('The loader should be a string');
    });
    const context = {
      ...mockContext,
      query: {
        alfa: {
          laoder: 'raw-loader' // laoder is a lapse!
        },
      },
      resourcePath: './index.js',
      emitError: emitError
    }
    const result = loader.pitch.call(
      context
    )
    expect(emitError).toHaveBeenCalled();
  });

  it('Unresolvable loader', () => {
    const emitError = jest.fn((e) => {
      expect(e.message).toMatch(/Cannot find module/);
    });
    const context = {
      ...mockContext,
      query: {
        alfa: {
          loader: 'bumblebee-loader', // unexisten
          options: {
            zs: 134
          }
        },
      },
      resourcePath: './index.js',
      emitError: emitError
    }
    const result = loader.pitch.call(
      context
    )
    expect(emitError).toHaveBeenCalled();
  });
});
