## Dupliquer le repo pour un nouveau projet

```
mkdir foo; cd foo 
# move to a scratch dir

git clone --bare https://github.com/exampleuser/old-repository.git
# Make a bare clone of the repository

cd old-repository.git
git push --mirror https://github.com/exampleuser/new-repository.git
# Mirror-push to the new repository

cd ..
rm -rf old-repository.git  
# Remove our temporary local repository
```

## Librairies
- NextJS
- ShadcnUI
- AuthJS
- Prisma
- Tailwind
- Zod