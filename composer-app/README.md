# Polydocs.xyz site

WHen deploying on an IPFS-based host, make sure to set PUBLIC_URL env variable to "x". 

Also using hashrouter is best practice because when referenced over IPFS, dynamic paths will not survive reloads. 