const fixWinOsPathSep = require(`../src/fixWinOsPathSep`);
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

function cutSpaces(str) {
  return str.replace(/[\s\n\r\t]*/g, '');
}

describe('Test winOs (roughly)', () => {
  it('fixWinOsPathSep should do its job correctly', () => {
    expect(fixWinOsPathSep('/path/to/project')).toBe('/path/to/project')
    expect(fixWinOsPathSep('\\path\\to\\project')).toBe('/path/to/project')
    expect(fixWinOsPathSep('C:\\path\\to\\project')).toBe('C:/path/to/project')
  })

  it('Final query should not contain query options', () => {
    function errorHandler(e) {
      throw e;
    }
    const context = {
      ...mockContext,
      query: {
        data: {
          loader: 'babel-loader',
          options: {
            output: 'C:\\root\\the_folder_name_should_not_be_fixed'
          }
        }
      },
      resourcePath: './index.js',
      emitError: errorHandler
    }
    const result = loader.pitch.call(
      context
    )
    expect(cutSpaces(result).includes('the_folder_name_should_not_be_fixed')).toBe(false);
  })

  it('Windows-style separators should be replaced, but inline query options does not', () => {
    function errorHandler(e) {
      throw e;
    }
    const context = {
      ...mockContext,
      query: {
        data: 'babel-loader?saveto=C:\\root\\the_folder_name_should_not_be_fixed'
      },
      resourcePath: './index.js',
      emitError: errorHandler
    }
    const result = loader.pitch.call(
      context
    )
    expect(cutSpaces(result)).toBe(`module.exports={};module.exports["data"]=require('!babel-loader?saveto=C:\\root\\the_folder_name_should_not_be_fixed!./index.js');`);
  })
});
