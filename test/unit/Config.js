/* global expect */
const { Config, ConfigException } = require('../../src/Config')
const path = require('path')

describe('unit::mh::Config', function(){

  it('should import a config', function(){
    expect( Config ).to.be.ok
  })
 
  describe('instance', function(){
  
    let config = null

    beforeEach(function(){
      config = new Config({
        path: [ __dirname, '..', '..' ], // base path for the app
        configs: [ __dirname, '..', 'fixture' ],
        defaults: {
          name: 'Forms',
          app: {
            port: {
              http: 5151
            }
          },
          db: {
            database: 'forms',
            username: 'dev',
            password: 'dev',
            dialect: 'mysql',
          }
        }
      })
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

    it('should find an existing property', function(){
      expect( config.has('env') ).to.be.true
    })
    it('should not find a non existant property', function(){
      expect( config.has('enva') ).to.be.false
    })
    it('should getCheck a property', function(){
      expect( config.getCheck('env') ).to.equal( 'test' )
    })
    it('should error when getCheck against a non existant property', function(){
      let fn = ()=> config.getCheck('enva') 
      expect( fn ).to.throw(/No config property/)
    })
    it('should load a file and overide defaults', function(){
      let config_path = path.resolve(__dirname,'..','fixture','config.json')
      config.loadFile(config_path)
      expect( config.get('app.port.http') ).to.equal( 5152 )
    })

    it('should set the name to default for a config', function(){
      expect( config.setName() ).to.be.ok
      expect( config.get('name') ).to.equal('default')
    })

    it('should set the name to exby for a config', function(){
      expect( config.setName('exby') ).to.be.ok
      expect( config.get('name') ).to.equal('exby')
    })
  
    it('should set a base path from string', function(){
      expect( config.setPath( __dirname ) ).to.be.ok
    })

    it('should set a base path from array', function(){
      expect( config.setPath( __dirname.split(path.sep)) ).to.be.ok
    })

    it('should set a config path from string', function(){
      expect( config.setConfigPath( __dirname ) ).to.be.ok
    })

    it('should set a config path from array', function(){
      expect( config.setConfigPath( __dirname.split(path.sep)) ).to.be.ok
    })

    it('should setEnv from a param', function(){
      expect( config.setEnv('whatever') ).to.be.ok
      expect( config.get('env') ).to.equal('whatever')
    })

    it('should error when setEnv to funny chars', function(){
      let fn = () => config.setEnv('whati %@# $#@ ever')
      expect( fn ).to.throw(ConfigException, /non alpha numeric characters/)
    })

    describe('messing with NODE_ENV', function(){
 
      let pre_node_env = process.env.NODE_ENV

      before(function(){
        delete process.env.NODE_ENV
      })
      after(function(){
        process.env.NODE_ENV = pre_node_env
      })
      it('should setEnv when NODE_ENV is development', function(){
        expect( config.setEnv() ).to.be.ok
        expect( config.get('env') ).to.equal('development')
      })
    })

    it('should return an object for toJSON', function(){
      expect( config.toJSON() ).to.eql({
        path: path.resolve(__dirname,'..','..'),
        config_path: path.resolve(__dirname,'..','fixture'),
        env:  'test',
        name: 'Forms',
        app: {
          port:{
            http:5151
          }
        },
        db:{
          database: 'forms',
          username: 'dev',
          password: 'dev',
          dialect:  'mysql'
        }
      })
    })

    it('should create an instance without configs', function(){
      config = new Config({
        path: [ __dirname ], // base path for the app
        defaults: {
          name: 'Forms',
        }
      })
      expect( config.get('path') ).to.equal(__dirname)
    })

    it('should create an instance without path', function(){
      config = new Config({
        configs: [ __dirname ], // base path for the app
        defaults: {
          name: 'Forms',
        }
      })
      expect( config.get('path') ).to.equal(__dirname)
    })

  })

  describe('argToPath', function(){
    it('should', function(){
      expect( Config.argToPath('/a') ).to.equal('/a')
    })
    it('should', function(){
      expect( Config.argToPath(['/a']) ).to.equal('/a')
    })
    it('should', function(){
      let fn = ()=> Config.argToPath()
      expect( fn ).to.throw(/required to convert to path/)
    })
  })

  describe('templating', function(){

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
