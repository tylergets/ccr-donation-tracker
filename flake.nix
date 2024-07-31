{
  description = "Description for the project";

  inputs = {
    flake-parts.url = "github:hercules-ci/flake-parts";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    devenv.url = "github:cachix/devenv";
  };

  outputs = inputs @ {self, flake-parts, ...}:
    flake-parts.lib.mkFlake {inherit inputs;} {
      imports = [
        inputs.devenv.flakeModule
      ];

      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "aarch64-darwin"
        "x86_64-darwin"
      ];

      perSystem = {
        config,
        self',
        inputs',
        pkgs,
        system,
        ...
      }: {
        packages = rec {
          server = import ./server.nix {inherit pkgs;};

          docker = pkgs.dockerTools.buildLayeredImage {
            name = "ghcr.io/tylergets/ccr-donation-tracker";
            tag = "latest";
            contents = [
              self.packages.x86_64-linux.server
              pkgs.busybox
              pkgs.mdbtools
            ];
            config = {
              Cmd = "${self.packages.${pkgs.stdenv.hostPlatform.system}.server}/bin/ccr-donation-tracker";
              Env = [
                "DATABASE_PATH=/data/db.sqlite"
              ];
            };
          };

        };

        formatter = pkgs.alejandra;

        devenv.shells.default = {
          packages = [
            pkgs.mdbtools
          ];

          languages = {
            python.enable = true;
            javascript = {
              enable = true;
              package = pkgs.nodejs_latest;
              npm.enable = true;
              bun = {
                enable = true;
              };
            };
          };

          processes = {
#            watch.exec = "npm run dev";
          };

          services.mailhog = {
            enable = true;
          };

        };
      };
    };
}
