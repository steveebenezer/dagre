#!/usr/bin/env node

var Benchmark = require("benchmark"),
    sprintf = require("sprintf").sprintf;

var Digraph = require("graphlib").Digraph,
    longestPath = require("../lib/rank/util").longestPath,
    feasibleTree = require("../lib/rank/feasible-tree"),
    networkSimplex = require("../lib/rank/network-simplex");

function runBenchmark(name, fn) {
  var options = {};
  options.onComplete = function(bench) {
    var target = bench.target,
        hz = target.hz,
        stats = target.stats,
        rme = stats.rme,
        samples = stats.sample.length,
        msg = sprintf("    %25s: %13s ops/sec \xb1 %s%% (%3d run(s) sampled)",
                      target.name,
                      Benchmark.formatNumber(hz.toFixed(2)),
                      rme.toFixed(2),
                      samples);
    console.log(msg);
  };
  options.onError = function(bench) {
    console.error("    " + bench.target.error);
  };
  options.setup = function() {
    this.count = Math.random() * 1000;
    this.nextInt = function(range) {
      return Math.floor(this.count++ % range );
    };
  };
  new Benchmark(name, fn, options).run();
}

var g = new Digraph()
  .setDefaultNodeLabel(function() { return {}; })
  .setDefaultEdgeLabel(function() { return { minlen: 1, weight: 1 }; })
  .setPath(["a", "b", "c", "d", "h"])
  .setPath(["a", "e", "g", "h"])
  .setPath(["a", "f", "g"]);


runBenchmark("longestPath", function() {
  longestPath(g);
});

runBenchmark("feasibleTree", function() {
  longestPath(g);
  feasibleTree(g);
});

runBenchmark("networkSimplex", function() {
  networkSimplex(g);
});
