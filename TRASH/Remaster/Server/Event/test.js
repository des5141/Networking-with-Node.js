module.exports = {
    func: (sock, string) => {
        console.log(string);
        sock.post(1, "a")
    },
    index: 0
}