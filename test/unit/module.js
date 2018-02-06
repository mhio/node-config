/* global expect */
const { Config, ConfigException, Exception } = require('../../')

describe('unit::mh::Config::module', function(){

  it('should import a Config', function(){
    expect( Config ).to.be.ok
  })
 
  it('should import a ConfigException', function(){
    expect( ConfigException ).to.be.ok
  })
 
  it('should import a Exception', function(){
    expect( Exception ).to.be.ok
  })

})
