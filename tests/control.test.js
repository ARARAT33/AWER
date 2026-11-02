import test from "node:test";
import assert from "node:assert/strict";
import {validRepoSlug,validGitRef} from "../api/managed/control.js";

test("accepts owner/repository slugs",()=>{assert.equal(validRepoSlug("ARARAT33/AWER"),true);});
test("rejects malformed repository slugs",()=>{for(const value of ["", "owner", "owner/repo/extra", "../repo", "owner/.."])assert.equal(validRepoSlug(value),false);});
test("accepts normal Git refs",()=>{for(const value of ["main","release/v1.2","feature/new-ui"])assert.equal(validGitRef(value),true);});
test("rejects unsafe Git refs",()=>{for(const value of ["", "../main", "a..b", "x".repeat(101), "main;rm"])assert.equal(validGitRef(value),false);});
