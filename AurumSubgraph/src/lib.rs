mod pb;
mod abi;

use pb::starknet::v1::*;
use crate::abi::reward_contract::Event as RewardEvent;

use substreams::Hex;
use cainome::cairo_serde::CairoSerde;
use starknet::core::types::Felt;
use substreams::log;
use crate::pb::sf::substreams::starknet::r#type::v1::Transactions;
use num_traits::cast::ToPrimitive;
use starknet::core::types::EmittedEvent;
#[substreams::handlers::map]
fn map_reward_events(transactions: Transactions) -> Result<Events, substreams::errors::Error> {
    let mut proto_events = Events::default();
    for transaction in transactions.transactions_with_receipt {
        let data = transaction.receipt.unwrap();

        let data_events = data.events;

        for event in data_events {
            let event_from_address = Hex(event.from_address.as_slice()).to_string();

            if event_from_address != "020a6e405f957ee966e6f1309039731f0f1d20a3074c035b08e4cfbfdb711b88" {
                continue;
            }

            let mut data_felts = vec![];
            let mut keys_felts = vec![];
            for key in event.keys {
                let key = Felt::from_bytes_be_slice(key.as_slice());
                keys_felts.push(key);
            }

            for bytes in event.data {
                let felt = Felt::from_bytes_be_slice(bytes.as_slice());
                data_felts.push(felt);
            }

            let emitted_event = EmittedEvent {
                from_address: Felt::from_bytes_be_slice(event.from_address.as_slice()),
                keys: keys_felts,
                data: data_felts,
                block_hash: None,
                block_number: None,
                transaction_hash: Felt::default(),
            };

            if let reward_event = RewardEvent::try_from(emitted_event).unwrap() {
                let event_json = serde_json::to_string(&reward_event).unwrap();
                let event = Event {
                    json_description: event_json
                };

                proto_events.events.push(event);
            }
        }
    }

    Ok(proto_events)
}
