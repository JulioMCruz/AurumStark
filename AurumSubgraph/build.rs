use cainome::rs::Abigen;
use std::collections::HashMap;

fn main() {
    // Aliases added from the ABI
    let mut aliases = HashMap::new();

    let reward_abigen =
        Abigen::new("reward", "./abi/reward_contract.abi.json").with_types_aliases(aliases).with_derives(vec!["serde::Serialize".to_string(), "serde::Deserialize".to_string()]);

        reward_abigen
            .generate()
            .expect("Fail to generate bindings")
            .write_to_file("./src/abi/reward_contract.rs")
            .unwrap();
}