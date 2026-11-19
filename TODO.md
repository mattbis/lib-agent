
1. now we need to generalise into the languages I like working with:-

Here are some rough guidelines on how these fit into my projects, both completed, and not completed, many are architected but need a lot of work. Note these guidelines are subject to change depending on how much I come to love each __way__ of doing things.... 

- Java
  - we will use for financial and messages; AI and reverse engineering stuff.
- Python3
  - we use as original glue - not giant projects that end up a mess - I really dislike huge python projects they are hard to read and a mess.
- Go
  - we will use mostly for applications that are highly efficient cli, networking and stuff like music governor
- Rust
  - we will use for highly memory controlled applications and runtimes. I am undecided about plugins but its easier doing clap with it than SDK Vst3
- Cplusplus
  - we will use across the board... but again we dislike huge projects since it can be a nightmare, and the language is almost like insanity since there are so many ways to do anything
- zig
  - we will use for small components, that need the power of C but super performance. and I really like the ethos behind it

For each language, we need to have solid rules for style... I like all code to be consistent and not a BULL OF MUD. Therefore the first task is to generalise the repo structure and to separate things into agnostic and common across programming.
