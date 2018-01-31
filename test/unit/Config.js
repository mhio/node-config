/* global expect */
const { Config } = require('../../src/Config')

describe('unit::mh::Config', function(){

  it('should import a config', function(){
    expect( Config ).to.be.ok
  })
 
  describe('instance', function(){
  
  let config = null

    beforeEach(function(){
      config = new Config()    
    })
    it('should get a config item', function(){
      expect( config.get('app.port.http') ).to.equal( 5151 )
    })

    it('should set a config item', function(){
      expect( config.set('http.port', 3333) ).to.be.ok
      expect( config.get('http.port') ).to.equal( 3333 )
    })

    it('should get an environment of test', function(){
      expect( config.get('env') ).to.equal( 'test' )
    })

    it('should replace {{a}} template strings', function(){
      expect( Config.templateString('a{{a}}b', {a:'1'}) ).to.equal('a1b')
    })

    it('should replace {{ a }} template strings', function(){
      expect( Config.templateString('a{{ a }}b', {a:'1'}) ).to.equal('a1b')
    })

    it('should replace {{ a}} template strings', function(){
      expect( Config.templateString('a{{ a}}b', {a:'1'}) ).to.equal('a1b')
    })

    it('should replace {{a }} template strings', function(){
      expect( Config.templateString('a{{a }}b', {a:'1'}) ).to.equal('a1b')
    })

    it('should replace a{{a}}b{{ b }}c template strings', function(){
      expect( Config.templateString('a{{a}}b{{ b }}c', {a:'1'}) ).to.equal('a1b{{ b }}c')
    })

    it('should replace {{a }} template strings', function(){
      expect( Config.templateString('a{{a}}b{{ b }}c', {a:'1',b:'2'}) ).to.equal('a1b2c')
    })

  })
})
