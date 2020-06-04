import request from "./request";

export default {
  processImage(image) {
    // return request("/process", "post", { image });

    return new Promise((resolve, reject) => {
      const ret = {
        PersonalSafetyModelVersion: "1.0",
        Persons: [
          {
            Id: 0,
            BoundingBox: {
              Width: 0.14000000059604645,
              Height: 0.10000000149011612,
              Left: 0.6700000166893005,
              Top: 0.18000000715255737,
            },
            Confidence: 99.91668701171875, // likelihood of the bbox containing a person
            BodyParts: [
              //This list contains detected body parts. It would be empty otherwise
              {
                Name: "Face", //enum: Face, Nose, Head, Left Hand, Right Hand
                Confidence: 99.44324232, // score for body part visibility
                Equipments: [
                  //This list would be empty, if no equipments are detected
                  {
                    EquipmentType: "Mask", // enum: Mask, Glove, Helmet
                    Confidence: 99.91668701171875, // likelihood of the bbox contains an equipment
                    BoundingBox: {
                      Width: 0.14000000059604645,
                      Height: 0.10000000149011612,
                      Left: 0.6700000166893005,
                      Top: 0.18000000715255737,
                    },
                    CoversBodyPart: {
                      Confidence: 50,
                    },
                  },
                ],
              },
              {
                Name: "Head",
                Confidence: 99.44324232,
                Equipments: [
                  {
                    EquipmentType: "Helmet",
                    Confidence: 99.91668701171875,
                    BoundingBox: {
                      Width: 0.14000000059604645,
                      Height: 0.10000000149011612,
                      Left: 0.6700000166893005,
                      Top: 0.18000000715255737,
                    },
                    CoversBodyPart: {
                      Value: true,
                      Confidence: 98.32423234,
                    },
                  },
                ],
              },
              {
                Name: "Left Hand",
                Confidence: 99.898934,
                Equipments: [
                  {
                    EquipmentType: "Glove",
                    Confidence: 99.91668701171875,
                    BoundingBox: {
                      Width: 0.14000000059604645,
                      Height: 0.10000000149011612,
                      Left: 0.6700000166893005,
                      Top: 0.18000000715255737,
                    },
                    CoversBodyPart: {
                      Value: true,
                      Confidence: 98.32423234,
                    },
                  },
                ],
              },
              {
                Name: "Right Hand",
                Confidence: 98.32423234,
                Equipments: [
                  {
                    EquipmentType: "Glove",
                    Confidence: 99.91668701171875,
                    BoundingBox: {
                      Width: 0.14000000059604645,
                      Height: 0.10000000149011612,
                      Left: 0.6700000166893005,
                      Top: 0.18000000715255737,
                    },
                    CoversBodyPart: {
                      Value: true,
                      Confidence: 98.32423234,
                    },
                  },
                ],
              },
            ],
          },
          {
            Id: 1,
            BoundingBox: {
              Width: 0.14000000059604645,
              Height: 0.10000000149011612,
              Left: 0.6700000166893005,
              Top: 0.18000000715255737,
            },
            Confidence: 99.91668701171875, // likelihood of the bbox containing a person
            BodyParts: [
              //This list contains detected body parts. It would be empty otherwise
              {
                Name: "Face", //enum: Face, Nose, Head, Left Hand, Right Hand
                Confidence: 99.44324232, // score for body part visibility
                Equipments: [
                  //This list would be empty, if no equipments are detected
                ],
              },
              {
                Name: "Head",
                Confidence: 99.44324232,
                Equipments: [
                  {
                    EquipmentType: "Helmet",
                    Confidence: 99.91668701171875,
                    BoundingBox: {
                      Width: 0.14000000059604645,
                      Height: 0.10000000149011612,
                      Left: 0.6700000166893005,
                      Top: 0.18000000715255737,
                    },
                    CoversBodyPart: {
                      Value: true,
                      Confidence: 98.32423234,
                    },
                  },
                ],
              },
              {
                Name: "Left Hand",
                Confidence: 99.898934,
                Equipments: [
                  // Missing Left Glove
                ],
              },
              {
                Name: "Right Hand",
                Confidence: 98.32423234,
                Equipments: [
                  {
                    EquipmentType: "Glove",
                    Confidence: 99.91668701171875,
                    BoundingBox: {
                      Width: 0.14000000059604645,
                      Height: 0.10000000149011612,
                      Left: 0.6700000166893005,
                      Top: 0.18000000715255737,
                    },
                    CoversBodyPart: {
                      Value: true,
                      Confidence: 98.32423234,
                    },
                  },
                ],
              },
            ],
          },
        ],
      };
      resolve([ret]);
      return;
    });
  },

  makePerson(person) {
    const HEAD = "Head";
    const LEFT_HAND = "Left Hand";
    const RIGHT_HAND = "Right Hand";
    const FACE = "Face";

    const getBodyPart = (person, bodyPart) => {
      return person.BodyParts.filter((p) => {
        return p.Name === bodyPart;
      })[0];
    };

    const hasProtection = (person, part) => {
      const bodyPart = getBodyPart(person, part);
      return bodyPart.Equipments.length >= 1;
    };

    const head = (person) => {
      const success = hasProtection(person, HEAD);
      return {
        TestName: "Head Protection",
        Id: person.Id,
        Details: "Person is wearing head protection",
        Success: success,
      };
    };

    const hands = (person) => {
      const success =
        hasProtection(person, LEFT_HAND) && hasProtection(person, RIGHT_HAND);
      return {
        TestName: "Hand Protection",
        Id: person.Id,
        Details: "Person is wearing hand protection",
        Success: success,
      };
    };

    const face = (person) => {
      const success = hasProtection(person, FACE);
      return {
        TestName: "Face Protection",
        Id: person.Id,
        Details: "Person is wearing face protection",
        Success: success,
      };
    };

    const tests = [head, hands, face];
    const results = tests.map((test) => {
      return test(person);
    });

    return {
      id: person.Id,
      results: results,
    };
  },
};
