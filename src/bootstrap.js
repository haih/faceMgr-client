import 'jquery';
import angular from 'angular';

/**
 * The IIFE keeps the angular variable out of global scope, but it's
 * available in ./app and anything it requires.
 *
 * Load jquery before angular and replace angular's jqLite elements
 */
(function iife() {
  angular.module('OrderProcessingClient', [
    require('./app'),
  ]);
}());
