;; subleq.wat - https://github.com/tripplyons/wasm-subleq

;; subleq instruction in C-like
;; *b -= *a; if(*b <= 0) goto c;

(module
;; instruction pointer
    (global $ip (import "js" "ip") (mut i32))
    (export "ip" (global $ip))

    (memory $mem 1)
    (export "memory" (memory $mem))

;; the basic subleq instruction (void -> void)
    (func $runInstr (local $subResult i32) (local $subPosition i32)
;; where to subtract from
        (local.set $subPosition
;; shift left to WASM addressing (1 item on tape is 32 bits = 2^5 bits)
            (i32.shl
                (i32.load
                    (i32.shl
                        (i32.add
                            (global.get $ip)
                            (i32.const 1)
                        )
                        (i32.const 5)
                    )
                )
                (i32.const 5)
            )
        )

;; the result of the subtraction
;; *b - *a
        (local.set
            $subResult
            (i32.sub
;; *b
                (i32.load
                    (local.get $subPosition)
                )
;; *a
                (i32.load
                    (i32.shl
                        (i32.load
                            (global.get $ip)
                        )
                        (i32.const 5)
                    )
                )
            )
        )

;; write the result back
;; (the assignment part of `*b -= *a`)
        (i32.store
            (local.get $subPosition)
            (local.get $subResult)
        )

;; change $ip accordingly
        (if
;; b <= 0
            (i32.le_s (local.get $subResult) (i32.const 0))
            (then
;; goto c
                (global.set $ip
                    (i32.load
                        (i32.shl
                            (i32.add (global.get $ip) (i32.const 2))
                            (i32.const 5)
                        )
                    )
                )
            )
            (else
;; move to the next line
                (global.set $ip
                    (i32.add
                        (global.get $ip)
                        (i32.const 3)
                    )
                )
            )
        )
    )
    (export "runInstr" (func $runInstr))

;; read from memory
    (func $get (param $adr i32) (result i32)
        (i32.load
            (i32.shl
                (local.get $adr)
                (i32.const 5)
            )
        )
    )
    (export "get" (func $get))

;; write to memory
    (func $set (param $adr i32) (param $val i32)
        (i32.store
            (i32.shl
                (local.get $adr)
                (i32.const 5)
            )
            (local.get $val)
        )
    )
    (export "set" (func $set))

;; read the instruction pointer
    (func $getIp (result i32)
        global.get $ip
    )
    (export "getIp" (func $getIp))

;; write to the instruction pointer
    (func $setIp (param $val i32)
        (global.set $ip (local.get $val))
    )
    (export "setIp" (func $setIp))
)
