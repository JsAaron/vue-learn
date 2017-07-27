/*  */
import {
  _Set as Set,
  parsePath
} from '../util/index'

import Dep, { pushTarget, popTarget } from './dep'

var uid = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
export default function Watcher(vm, expOrFn, cb, options) {
  this.vm = vm;
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new Set();
  this.newDepIds = new Set();
  this.expression = expOrFn.toString();

  //如果只函数，表达式就是get方法
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    //否则就需要进一步解析
    this.getter = parsePath(expOrFn);
  }

  //如果没有懒加载，那么就马上获取
  //计算属性的时候lazy为true
  //watch为lazy:false
  this.value = this.lazy ?
    undefined :
    this.get();
};

/**
 * 执行getter方法，并且收集依赖
 */
Watcher.prototype.get = function get() {
  pushTarget(this);
  var value;
  var vm = this.vm;
  value = this.getter.call(vm, vm);
};

/**
 * wather-get => _data => 
 * @param {[type]} dep [description]
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};



