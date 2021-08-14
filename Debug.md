# Debugging Documentation

Guides to common problems faced when setting up the repo

> This is not foolproof, but it may help you to quickly debug some issues that you may face in your system

### Problems with Keccak/Truffle

If you face something that looks like the error messages below:

```
gyp ERR! cwd C:...\node_modules\keccak
gyp ERR! node -v v14.16.1
gyp ERR! node-gyp -v v5.1.0
gyp ERR! not ok
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! keccak@1.4.0 rebuild: `node-gyp rebuild`
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the keccak@1.4.0 rebuild script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.
npm WARN Local package.json exists, but node_modules missing, did you mean to install?
npm ERR! A complete log of this run can be found in:
npm ERR!     C:...-debug.log
"Keccak bindings compilation fail. Pure JS implementation will be used.
```

#### Possible Solution

Install truffle with

```
npm install -g truffle --unsafe-perm
```

### Problems with Scrypt

If you face any issues with Scrypt as shown in the error messages, this is due to the poor node package management with Scrypt.  
This should already be added into the repository but you can download specific Scrypt versions directly.

#### Possible Solution

The version below works for us.

```
npm install github:barrysteyn/node-scrypt#fb60a8d3c158fe115a624b5ffa7480f3a24b03fb
```

---

Thank you
