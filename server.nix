{pkgs}:
pkgs.buildNpmPackage rec {
  pname = "ccr-donation-tracker";
  version = "0.1.0";

  src = ./.;
  npmDepsHash = "sha256-1/UdN7nMHDBFsXJQQ1nrYZnII3n36raDQFowN3rCGD4=";

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
