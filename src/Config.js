const debug = require('debug')('mh:Config')
const fs = require('fs')
const path = require('path')
const get = require('lodash.get')
const set = require('lodash.set')
const has = require('lodash.has')
const assign = require('lodash.assign')
const { Exception } = require('@mhp/exception')

// Assumes first level `node_modules/@mh/config/src`
const default_path = path.join(__dirname, '..', '..', '..', '..')

// Base error for and config problems
class ConfigException extends Exception {}

// # Config

// `path` Set the base path for the app.
// `defaults` Supply a base config that changes are applied on top of.
// `file` Read a directory in, uses `environment`.

class Config {

  static templateString( str, values ){
    return str.replace(/{{\s*([\w.]+)\s*}}/g, (found, name)=> {
      let str = get(values,name)
      if ( str === undefined ) return found
      return str
    })
  }

  constructor( options ){
    this._config = {}
    this._default_config = {}
    this._loaded_config = {}
    this._name = options.name || 'default'
    
    // Use configs for base path if needed
    if ( options.configs ){
      this.setConfigPath(options.configs)
      if ( !options.path ) this.setPath(options.configs, '..')
      else this.setPath(options.path)
    } else {
      if ( !options.path ) this.setPath(default_path)
      else this.setPath(options.path)
    }
    this.setEnv(options.env)
    this.defaultConfig(options.defaults)
    if ( options.file ) this.loadFile(options.file)
  }

  loadFile( file ){
    debug('Loading configfrom file "%s"', file)
    let file_data = fs.readFileSync(file)
    let json = JSON.parse(file_data)
    this._loaded_config = json
    debug('Merging file config', this._loaded_config)
    this._config = assign(this._loaded_config)
  }

  defaultConfig( config ){
    this._default_config = config
    this.assignConfig(this._default_config)
  }
  assignConfig( extra ){
    debug('Assign config on top', extra)
    return assign(this._config, extra)
  }

  set( name, value ){
    debug('Setting config "%s" to "%s', name, value)
    return set(this._config, name, value)
  }

  get( name ){
    let val = get(this._config, name)
    if (typeof val !== 'string') return val
    debug('get0', name, val)
    val = this.constructor.templateString(val, this._config)
    debug('get1', name, val)
    val = this.constructor.templateString(val, this._config)
    debug('get2', name, val)
    return val
  }

  getCheck( name ){
    if (!this.has(name)) throw new ConfigException(`No config property "${name}"`)
    return this.get(name)
  }

  has( name ){
    return has(this._config, name)
  }

  // Set the name/label for this config instance.
  // The default name is `default`
  setName( config_name ){
    if ( config_name === undefined ) config_name = 'default'
    return this.set('name', config_name)
  }

  // Env defaults to `NODE_ENV` or else `development`
  setEnv( env ){
    if ( ! env ) env = process.env.NODE_ENV
    if ( ! env ) env = 'development'
    if ( ! /^\w+$/.test(env) ) {
      throw new ConfigException(`env includes non alpha numeric characters [${env}]`)
    }
    return this.set('env', env)
  }

  setPath( dirs ){
    let base_path = Config.argToPath(dirs)
    debug('set base path to', base_path)
    return this.set('path', base_path)
  }

  setConfigPath( dirs ){
    let config_path = Config.argToPath(dirs)
    debug('set base path to', config_path)
    return this.set('config_path', config_path)
  }

  toJSON(){
    return this._config
  }

  static argToPath( ...dirs ){
    if ( dirs[0] === undefined || dirs[0] === null ) {
      throw new ConfigException(`Directories required to convert to path, got "${dirs}"`)
    }
    if ( Array.isArray(dirs[0]) ) dirs = dirs[0]
    let joined_path = path.join(...dirs)
    let resolved_path = path.resolve(joined_path)
    return resolved_path
  }

}

module.exports = { Config, ConfigException, Exception }
