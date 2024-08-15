{pkgs}:
pkgs.buildNpmPackage rec {
  pname = "ccr-donation-tracker";
  version = "0.1.0";

  src = ./.;
  npmDepsHash = "sha256-MWg2ZiVjyKv97UfdwKwJtHkVf7EmvKqm8ByMkM59+XA=";

  nodejs = pkgs.nodejs_latest;

  npmPackFlags = ["--ignore-scripts"];

  NODE_OPTIONS = "--openssl-legacy-provider";

  buildInputs = [
    pkgs.mdbtools
  ];

  meta = {
    description = "CCR Donation Tracker";
    homepage = "https://github.com/tylergets/ccr-donation-tracker";
  };
}
