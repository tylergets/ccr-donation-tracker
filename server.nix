{pkgs}:
pkgs.buildNpmPackage rec {
  pname = "ccr-donation-tracker";
  version = "0.1.0";

  src = ./.;
  npmDepsHash = "sha256-3ADl0JmeY8KKQXQJT+LKsRvNzpF3xwlPY/qNgG3tC7A=";

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
